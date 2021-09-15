// Trie data structure.
// The need for Trie arises from multi-token phrases we may need to lookup,
// without knowing ahead of time the length of the input string.
//
// Trie seems like an overkill since words/phrases in the dictionary are typically
// very short (usually just one word, occasionally 2 or 3, very rarely more than that),
// but we can't think of a significantly simpler way to do it without Tries.
//
// This implementation is tightly coupled to stemming and normalization.
// It is not good - we would prefer it to be generic.
// Doing stemming here makes it much easier to handle non-word tokens
// which must be preserved by the matcher.
class Trie {
  private static readonly IGNORED_PREFIXES = ['a ', 'an ', 'to '];
  private static readonly IGNORED_SUFFIXES = [', to'];

  root: TrieNode;
  stemmer: Stemmer;
  tokenizer: Tokenizer;

  constructor(stemmer: Stemmer, tokenizer: Tokenizer) {
    this.root = new TrieNode();
    this.stemmer = stemmer;
    this.tokenizer = tokenizer;
  }

  insert(entry: DictionaryEntry): void {
    let words = this.toWords(
      this.removeIgnoredSuffixes(this.removeIgnoredPrefixes(entry.value))
    );
    let node: TrieNode = this.root;
    words.forEach((word: string) => {
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

  // Try finding a match in a trie starting at tokens[firstTokenIndex].
  // Finds the longest, in terms of the number of words, match.
  //
  // Returns a tuple of:
  // - If there's a match:
  //   - index of the first token after the match.
  //   - DictionaryEntry corresponding to the match.
  // - If there's no match:
  //   - [null, null]
  match(
    tokens: Array<Token>,
    firstTokenIndex: number
  ): [number, DictionaryEntry] {
    let node = this.root;
    let i = firstTokenIndex;
    let result: [number, DictionaryEntry] = [null, null];

    // Walk down the trie until we find a match.
    while (i < tokens.length) {
      if (!tokens[i].isWord) {
        // Strip this token.
        i++;
        continue;
      }
      let word = tokens[i].value;
      let key = word.toLowerCase();
      if (this.stemmer !== null) {
        key = this.stemmer.stem(word);
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

  // Break the input into words and "normalize" them.
  private toWords(input: string): Array<string> {
    let result: Array<string> = [];
    this.tokenizer.tokenize(input.toLowerCase()).forEach((token: Token) => {
      if (!token.isWord) {
        return;
      }
      let word = token.value;
      if (this.stemmer !== null) {
        word = this.stemmer.stem(word);
        if (!word) {
          return;
        }
      }
      result.push(word);
    });
    return result;
  }

  private removeIgnoredSuffixes(input: string): string {
    let result = input;
    Trie.IGNORED_SUFFIXES.forEach(function (suffix: string) {
      if (result.toLowerCase().endsWith(suffix)) {
        result = result.substring(0, result.length - suffix.length);
      }
    });
    return result;
  }

  private removeIgnoredPrefixes(input: string): string {
    let result = input;
    Trie.IGNORED_PREFIXES.forEach(function (prefix: string) {
      if (result.toLowerCase().lastIndexOf(prefix, 0) === 0) {
        result = result.substring(prefix.length);
      }
    });
    return result;
  }
}

class TrieNode {
  key: string;
  value?: DictionaryEntry;
  children: Map<string, TrieNode> = new Map<string, TrieNode>();
}
