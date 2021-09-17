///<reference path="cachingStemmer.ts" />
///<reference path="stemmer.ts" />
///<reference path="matchResultEntry.ts" />
///<reference path="token.ts" />
///<reference path="tokenizer.ts" />
///<reference path="trie.ts" />
///<reference path="../common/dictionaryEntry.ts" />
///<reference path="../common/group.ts" />

/**
 * Matching logic.
 */
interface MatchFinder {
  /**
   * Detect matches in a string.
   * @param input Text string.
   * @returns List of match results. Concatenated are guaranteed to be equal to the input.
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

class MatchFinderImpl implements MatchFinder {
  private dictionary: Array<DictionaryEntry>;
  // Map lang->Stemmer
  private stemmers: Map<string, Stemmer>;
  private groups: Array<Group>;

  private strictTrie: Trie;
  // Map: language->TrieNode
  private nonStrictTries: Map<string, Trie>;

  // Caches to avoid running somewhat expensive stemming more than once
  // on the same word.
  // Map: language->stemmer
  private cachingStemmers: Map<string, CachingStemmer>;

  private tokenizer: Tokenizer;

  constructor(
    dictionary: Array<DictionaryEntry>,
    stemmers: Map<string, Stemmer>,
    groups: Array<Group>
  ) {
    this.dictionary = dictionary;
    this.stemmers = stemmers;
    this.groups = groups;
    this.tokenizer = new Tokenizer();
    this.strictTrie = new Trie(null, this.tokenizer);
    this.nonStrictTries = new Map<string, Trie>();
    this.cachingStemmers = new Map<string, CachingStemmer>();
  }

  // Find matches in the input.
  // Tokenize the input and iterate from left to right,
  // trying to find a match starting from that position.
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
      let [endIndex, match] = this.matchFromIndex(tokens, i);
      if (match !== null) {
        // Found match.
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
    this.pushMatchIfNotEmpty(result, currentNoMatch, null);
    return result;
  }

  // Build indexes/tries. Must be called before matching.
  // Not automatically calling from the constructor to prevent
  // unnecessary calculations when highlighting is disabled.
  buildIndexes(): void {
    if (!this.stemmers) {
      return;
    }

    this.strictTrie = new Trie(null, this.tokenizer);
    this.nonStrictTries = new Map<string, Trie>();
    this.cachingStemmers = new Map<string, CachingStemmer>();
    let groupIdToGroup = new Map<number, Group>();

    // Map group ids to groups
    this.groups.forEach((group: Group) => {
      groupIdToGroup.set(group.id, group);
    });

    // Initialize caching stemmers and non-strict tries.
    this.getMatchLanguages().forEach((matchingLanguage) => {
      this.cachingStemmers.set(
        matchingLanguage,
        new CachingStemmer(this.stemmers.get(matchingLanguage))
      );
      this.nonStrictTries.set(
        matchingLanguage,
        new Trie(this.stemmers.get(matchingLanguage), this.tokenizer)
      );
    });

    // Populate tries.
    this.dictionary.forEach((entry: DictionaryEntry) => {
      if (!groupIdToGroup.has(entry.groupId)) {
        // The group is not enabled.
        return;
      }
      let group = groupIdToGroup.get(entry.groupId);
      this.strictTrie.insert(entry);
      if (!entry.strictMatch && this.shouldSmartMatch(group)) {
        this.nonStrictTries.get(group.matchingLanguage).insert(entry);
      }
    });
  }

  // Releasing memory.
  // Can't cleanup tries - they need to be available if the page is updated -
  // but it's safer to release stem cache.
  cleanup(): void {
    this.cachingStemmers.forEach((stemmer) => stemmer.clear());
  }

  // Get different languages for matching.
  private getMatchLanguages(): Array<string> {
    let result: Array<string> = [];
    this.groups.forEach((group: Group) => {
      if (this.shouldSmartMatch(group)) {
        if (result.indexOf(group.matchingLanguage) < 0) {
          result.push(group.matchingLanguage);
        }
      }
    });
    return result;
  }

  private matchFromIndex(
    tokens: Array<Token>,
    firstTokenIndex: number
  ): [number, DictionaryEntry] {
    // Try finding a match in the "strict" trie, starting from tokens[i].
    let [endIndex, match] = this.strictTrie.match(tokens, firstTokenIndex);
    if (match !== null) {
      return [endIndex, match];
    } else {
      // Try finding a match in the "non-strict" trie, starting from tokens[i].
      [endIndex, match] = [null, null];
      this.nonStrictTries.forEach((trie: Trie) => {
        if (match !== null) {
          // Already found a match.
          return;
        }
        [endIndex, match] = trie.match(tokens, firstTokenIndex);
      });
      return [endIndex, match];
    }
  }

  private shouldSmartMatch(group: Group) {
    return (
      group.matchingType == MatchingType.SMART &&
      this.stemmers.has(group.matchingLanguage)
    );
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
