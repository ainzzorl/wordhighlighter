///<reference path="stemmer.ts" />
///<reference path="matchResultEntry.ts" />
///<reference path="token.ts" />
///<reference path="../common/dictionaryEntry.ts" />

/**
 * Matching logic.
 */
interface MatchFinder {
  /**
   * Detect matches in a string.
   * @param input Text string.
   */
  findMatches(input: string): Array<MatchResultEntry>;

  /**
   * Build indexes.
   */
  buildIndexes(): void;

  /**
   * Cleanup.
   */
  cleanup(): void;
}

class TrieNode {
  key: string;
  value?: DictionaryEntry;
  // TODO: use maps
  children: any = new Object();
}

class MatchFinderImpl implements MatchFinder {
  dictionary: Array<DictionaryEntry>;
  stemmer: Stemmer;

  // Trie data structure.
  // The need for Trie arises from multi-token phrases we may need to lookup,
  // without knowing ahead of time the length of the input string.
  //
  // Trie seems like an overkill since words/phrases in the dictionary are typically
  // very short (usually just one word, occasionally 2 or 3, very rarely more than that),
  // but we can't think of a significantly simpler way to do it without Tries.
  strictTrie: TrieNode;
  nonStrictTrie: TrieNode;

  // A cache to avoid running somewhat expensive stemming more than once
  // on the same word.
  // TODO: use maps.
  // TODO: maybe extract something like "CachingStemmer"?
  contentWordStems: any;

  private IGNORED_PREFIXES = ['a ', 'an ', 'to '];
  private IGNORED_SUFFIXES = [', to'];

  constructor(dictionary: Array<DictionaryEntry>, stemmer: Stemmer) {
    this.dictionary = dictionary;
    this.stemmer = stemmer;
    this.strictTrie = new TrieNode();
    this.nonStrictTrie = new TrieNode();
    this.contentWordStems = new Object();
  }

  // Detect words matching the dictionary in the input.
  findMatches(input: string): Array<MatchResultEntry> {
    let result: Array<MatchResultEntry> = [];
    let tokens = this.tokenize(input);
    let i = 0;
    let currentNoMatch = '';
    while (i < tokens.length) {
      let token = tokens[i];
      if (!token.isWord) {
        currentNoMatch += token.value;
        i++;
        continue;
      }
      // Try finding a match in the "strict" trie, starting from tokens[i].
      let [endIndex, match] = this.matchWithTrie(
        tokens,
        i,
        this.strictTrie,
        true
      );
      if (match !== null) {
        // Found "strict" match.
        this.pushMatchIfNotEmpty(result, currentNoMatch, null);
        this.pushMatchIfNotEmpty(
          result,
          tokens
            .slice(i, endIndex)
            .map((t) => t.value)
            .join(''),
          match
        );
        currentNoMatch = '';
        i = endIndex;
      } else {
        // Try finding a match in the "non-strict" trie, starting from tokens[i].
        [endIndex, match] = this.matchWithTrie(
          tokens,
          i,
          this.nonStrictTrie,
          false
        );
        if (match !== null) {
          // Found "non-strict" match.
          this.pushMatchIfNotEmpty(result, currentNoMatch, null);
          this.pushMatchIfNotEmpty(
            result,
            tokens
              .slice(i, endIndex)
              .map((t) => t.value)
              .join(''),
            match
          );
          currentNoMatch = '';
          i = endIndex;
        } else {
          // No match starting from i-th token.
          i += 1;
          currentNoMatch += token.value;
        }
      }
    }
    this.pushMatchIfNotEmpty(result, currentNoMatch, null);
    return result;
  }

  // Try finding a match in a trie starting at tokens[firstTokenIndex].
  // Finds the longest, in terms of the number of words, match.
  //
  // Returns a tuple of:
  // - If there's a match:
  //   - index of the first token after the match.
  //   - DictionaryEntry corresponding to the match.
  // - If there's no match:
  //   - [null, null]
  matchWithTrie(
    tokens: Array<Token>,
    firstTokenIndex: number,
    trie: TrieNode,
    strict: boolean
  ): [number, DictionaryEntry] {
    let node = trie;
    let i = firstTokenIndex;
    let result: [number, DictionaryEntry] = [null, null];

    // Walk down the trie until we find a match.
    while (i < tokens.length) {
      if (!tokens[i].isWord) {
        // Stip this token.
        i++;
        continue;
      }
      let word = tokens[i].value;
      let key = word.toLowerCase();
      if (!strict) {
        // TODO: extract this block.
        let cachedStem = this.contentWordStems[word];
        if (cachedStem) {
          key = cachedStem;
        } else {
          key = this.stemmer.stem(key);
          this.contentWordStems[word] = key;
        }
      }
      if (key in node.children) {
        node = node.children[key];
        if (node.value) {
          // Found a match.
          // But keep looking for a longer match.
          result = [i + 1, node.value];
        }
        // Keep walking.
        i++;
      } else {
        return result;
      }
    }
    return result;
  }

  // Build indexes/tries. Must be called before matching.
  // Not automatically calling from the constructor to prevent
  // unnecessary calculations when highlighting is disabled.
  buildIndexes(): void {
    this.strictTrie = new TrieNode();
    this.nonStrictTrie = new TrieNode();
    this.contentWordStems = new Object();
    if (!this.stemmer) {
      return;
    }
    this.dictionary.forEach((entry: DictionaryEntry) => {
      this.insertIntoTrie(entry, this.strictTrie, true);
      if (!entry.strictMatch) {
        this.insertIntoTrie(entry, this.nonStrictTrie, false);
      }
    });
  }

  private insertIntoTrie(
    entry: DictionaryEntry,
    trie: TrieNode,
    strict: boolean
  ): void {
    let normalizedWords: string[];
    if (strict) {
      normalizedWords = this.getNormalizedWords(entry.value, false);
    } else {
      normalizedWords = this.getNormalizedWords(
        this.removeIgnoredSuffixes(this.removeIgnoredPrefixes(entry.value)),
        true
      );
    }
    let node: TrieNode = trie;
    normalizedWords.forEach((word: string) => {
      if (word in node.children) {
        node = node.children[word] as TrieNode;
      } else {
        node.children[word] = new TrieNode();
        node.children[word].key = word;
        node = node.children[word];
      }
    });
    node.value = entry;
  }

  // Releasing memory.
  // Can't cleanup tries - they need to be available if the page is updated -
  // but it's safer to release stem cache.
  cleanup(): void {
    this.contentWordStems = new Object();
  }

  // Breake the input into words and "normalize" them.
  private getNormalizedWords(input: string, doStem: boolean): Array<string> {
    let result: Array<string> = [];
    this.tokenize(input.toLowerCase()).forEach((token: Token) => {
      if (!token.isWord) {
        return;
      }
      let word = token.value;
      if (doStem) {
        word = this.stemmer.stem(word);
        if (!word) {
          return;
        }
      }
      result.push(word);
    });
    return result;
  }

  private tokenize(input: String): Array<Token> {
    let result: Array<Token> = [];
    let currentWord = '';
    let currentNonWord = '';
    for (let i = 0; i < input.length; ++i) {
      if (this.isWordCharacter(input[i])) {
        this.pushTokenIfNotEmpty(result, currentNonWord, false);
        currentNonWord = '';
        currentWord += input[i];
      } else {
        this.pushTokenIfNotEmpty(result, currentWord, true);
        currentWord = '';
        currentNonWord += input[i];
      }
    }
    this.pushTokenIfNotEmpty(result, currentNonWord, false);
    this.pushTokenIfNotEmpty(result, currentWord, true);
    return result;
  }

  private isWordCharacter(char: string) {
    return (
      (char[0] >= '0' && char[0] <= '9') ||
      // Latin
      (char[0] >= 'a' && char[0] <= 'z') ||
      (char[0] >= 'A' && char[0] <= 'Z') ||
      // Chinese or Japanese
      char[0].match(/[\u3400-\u9FBF]/) ||
      // Russian
      (char[0] >= 'а' && char[0] <= 'я') ||
      (char[0] >= 'А' && char[0] <= 'Я') ||
      // Misc diacritics
      (char[0] >= 'À' && char[0] <= 'ÿ')
    );
  }

  private removeIgnoredPrefixes(input: string): string {
    let result = input;
    this.IGNORED_PREFIXES.forEach(function (prefix: string) {
      if (result.toLowerCase().lastIndexOf(prefix, 0) === 0) {
        result = result.substring(prefix.length);
      }
    });
    return result;
  }

  private removeIgnoredSuffixes(input: string): string {
    let result = input;
    this.IGNORED_SUFFIXES.forEach(function (suffix: string) {
      if (result.toLowerCase().endsWith(suffix)) {
        result = result.substring(0, result.length - suffix.length);
      }
    });
    return result;
  }

  private pushMatchIfNotEmpty(
    result: Array<MatchResultEntry>,
    value: string,
    matchOf: DictionaryEntry
  ) {
    if (value.length > 0) {
      result.push({
        value: value,
        matchOf: matchOf,
      });
    }
  }

  private pushTokenIfNotEmpty(
    result: Array<Token>,
    value: string,
    isWord: boolean
  ) {
    if (value.length > 0) {
      result.push({
        value: value,
        isWord: isWord,
      });
    }
  }
}
