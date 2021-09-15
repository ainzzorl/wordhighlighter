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

  private matchingLanguages: Array<string>;

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
      let [endIndex, match] = this.strictTrie.match(tokens, i);
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
          [endIndex, match] = this.nonStrictTries
            .get(this.matchingLanguages[languageIndex])
            .match(tokens, i);
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

  // Build indexes/tries. Must be called before matching.
  // Not automatically calling from the constructor to prevent
  // unnecessary calculations when highlighting is disabled.
  buildIndexes(): void {
    this.strictTrie = new Trie(null, this.tokenizer);
    this.nonStrictTries = new Map<string, Trie>();
    this.cachingStemmers = new Map<string, CachingStemmer>();
    this.matchingLanguages = [];
    if (!this.stemmers) {
      return;
    }
    let groupIdToGroup = new Map<number, Group>();
    this.groups.forEach((group: Group) => {
      if (this.shouldSmartMatch(group)) {
        if (this.matchingLanguages.indexOf(group.matchingLanguage) < 0) {
          this.matchingLanguages.push(group.matchingLanguage);
          this.cachingStemmers.set(
            group.matchingLanguage,
            new CachingStemmer(this.stemmers.get(group.matchingLanguage))
          );
        }
        this.nonStrictTries.set(
          group.matchingLanguage,
          new Trie(this.stemmers.get(group.matchingLanguage), this.tokenizer)
        );
      }
      groupIdToGroup.set(group.id, group);
    });
    this.dictionary.forEach((entry: DictionaryEntry) => {
      if (!groupIdToGroup.has(entry.groupId)) {
        return;
      }
      let group = groupIdToGroup.get(entry.groupId);
      this.strictTrie.insert(entry);
      if (!entry.strictMatch && this.shouldSmartMatch(group)) {
        this.nonStrictTries.get(group.matchingLanguage).insert(entry);
      }
    });
  }

  private shouldSmartMatch(group: Group) {
    return (
      group.matchingType == MatchingType.SMART &&
      this.stemmers.has(group.matchingLanguage)
    );
  }

  // Releasing memory.
  // Can't cleanup tries - they need to be available if the page is updated -
  // but it's safer to release stem cache.
  cleanup(): void {
    this.cachingStemmers.forEach((stemmer) => stemmer.clear());
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
