///<reference path="cachingStemmer.ts" />
///<reference path="stemmer.ts" />
///<reference path="matchResultEntry.ts" />
///<reference path="token.ts" />
///<reference path="tokenizer.ts" />
///<reference path="../common/dictionaryEntry.ts" />
///<reference path="../common/group.ts" />

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
  children: Map<string, TrieNode> = new Map<string, TrieNode>();
}

class MatchFinderImpl implements MatchFinder {
  private dictionary: Array<DictionaryEntry>;
  // Map lang->Stemmer
  private stemmers: Map<string, Stemmer>;
  private groups: Array<Group>;

  // Trie data structure.
  // The need for Trie arises from multi-token phrases we may need to lookup,
  // without knowing ahead of time the length of the input string.
  //
  // Trie seems like an overkill since words/phrases in the dictionary are typically
  // very short (usually just one word, occasionally 2 or 3, very rarely more than that),
  // but we can't think of a significantly simpler way to do it without Tries.
  private strictTrie: TrieNode;
  // Map: language->TrieNode
  private nonStrictTries: Map<string, TrieNode>;

  // Caches to avoid running somewhat expensive stemming more than once
  // on the same word.
  // Map: language->stemmer
  private cachingStemmers: Map<string, CachingStemmer>;

  private matchingLanguages: Array<string>;

  private tokenizer: Tokenizer;

  private IGNORED_PREFIXES = ['a ', 'an ', 'to '];
  private IGNORED_SUFFIXES = [', to'];

  constructor(
    dictionary: Array<DictionaryEntry>,
    stemmers: Map<string, Stemmer>,
    groups: Array<Group>
  ) {
    this.dictionary = dictionary;
    this.stemmers = stemmers;
    this.groups = groups;
    this.strictTrie = new TrieNode();
    this.nonStrictTries = new Map<string, TrieNode>();
    this.cachingStemmers = new Map<string, CachingStemmer>();
    this.tokenizer = new Tokenizer();
  }

  // Detect words matching the dictionary in the input.
  findMatches(input: string): Array<MatchResultEntry> {
    let result: Array<MatchResultEntry> = [];
    let tokens = this.tokenizer.tokenize(input);
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
        true,
        null
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
        [endIndex, match] = [null, null];
        for (
          let languageIndex = 0;
          languageIndex < this.matchingLanguages.length;
          languageIndex++
        ) {
          [endIndex, match] = this.matchWithTrie(
            tokens,
            i,
            this.nonStrictTries.get(this.matchingLanguages[languageIndex]),
            false,
            this.matchingLanguages[languageIndex]
          );
          if (match !== null) {
            break;
          }
        }
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
    strict: boolean,
    matchingLanguage: string
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
        key = this.cachingStemmers.get(matchingLanguage).stem(word);
      }
      if (node.children.has(key)) {
        node = node.children.get(key);
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
    this.nonStrictTries = new Map<string, TrieNode>();
    this.cachingStemmers = new Map<string, CachingStemmer>();
    this.matchingLanguages = [];
    if (!this.stemmers) {
      return;
    }
    let groupIdToGroup = new Map<number, Group>();
    this.groups.forEach((group: Group) => {
      if (this.shouldSmartMatch(group)) {
        this.nonStrictTries.set(group.matchingLanguage, new TrieNode());
        if (this.matchingLanguages.indexOf(group.matchingLanguage) < 0) {
          this.matchingLanguages.push(group.matchingLanguage);
          this.cachingStemmers.set(
            group.matchingLanguage,
            new CachingStemmer(this.stemmers.get(group.matchingLanguage))
          );
        }
      }
      groupIdToGroup.set(group.id, group);
    });
    this.dictionary.forEach((entry: DictionaryEntry) => {
      let group = groupIdToGroup.get(entry.groupId);
      this.insertIntoTrie(entry, this.strictTrie, true, group.matchingLanguage);
      if (!entry.strictMatch && this.shouldSmartMatch(group)) {
        this.insertIntoTrie(
          entry,
          this.nonStrictTries.get(group.matchingLanguage),
          false,
          group.matchingLanguage
        );
      }
    });
  }

  private shouldSmartMatch(group: Group) {
    return (
      group.matchingType == MatchingType.SMART &&
      this.stemmers.has(group.matchingLanguage)
    );
  }

  private insertIntoTrie(
    entry: DictionaryEntry,
    trie: TrieNode,
    strict: boolean,
    stemmingLanguage: string
  ): void {
    let normalizedWords: string[];
    if (strict) {
      normalizedWords = this.getNormalizedWords(
        entry.value,
        false,
        stemmingLanguage
      );
    } else {
      normalizedWords = this.getNormalizedWords(
        this.removeIgnoredSuffixes(this.removeIgnoredPrefixes(entry.value)),
        true,
        stemmingLanguage
      );
    }
    let node: TrieNode = trie;
    normalizedWords.forEach((word: string) => {
      if (node.children.has(word)) {
        node = node.children.get(word);
      } else {
        let newNode = new TrieNode();
        newNode.key = word;
        node.children.set(word, newNode);
        node = newNode;
      }
    });
    node.value = entry;
  }

  // Releasing memory.
  // Can't cleanup tries - they need to be available if the page is updated -
  // but it's safer to release stem cache.
  cleanup(): void {
    this.cachingStemmers.forEach((stemmer) => stemmer.clear());
  }

  // Break the input into words and "normalize" them.
  private getNormalizedWords(
    input: string,
    doStem: boolean,
    stemmingLanguage: string
  ): Array<string> {
    let result: Array<string> = [];
    this.tokenizer.tokenize(input.toLowerCase()).forEach((token: Token) => {
      if (!token.isWord) {
        return;
      }
      let word = token.value;
      if (doStem) {
        word = this.stemmers.get(stemmingLanguage).stem(word);
        if (!word) {
          return;
        }
      }
      result.push(word);
    });
    return result;
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
}
