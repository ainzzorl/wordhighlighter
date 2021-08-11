///<reference path="stemmer.ts" />

/**
 * A wrapper for stemmers that caches the results.
 */
class CachingStemmer implements Stemmer {
  private stemmer: Stemmer;
  private cache: Map<string, string>;

  constructor(stemmer: Stemmer) {
    this.stemmer = stemmer;
    this.cache = new Map<string, string>();
  }

  stem(token: string): string {
    let cached = this.cache.get(token);
    if (cached) {
      return cached;
    } else {
      let stem = this.stemmer.stem(token);
      this.cache.set(token, stem);
      return stem;
    }
  }

  clear() {
    this.cache = new Map<string, string>();
  }
}
