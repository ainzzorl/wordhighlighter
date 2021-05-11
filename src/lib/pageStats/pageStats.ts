///<reference path="../common/dictionaryEntry.ts" />

interface WordAppeances {
  dictionaryEntry: DictionaryEntry;
  count: number;
}

/**
 * Statistics about a page load.
 */
class PageStats {
  // (dictionary entry id)->(number of appearances)
  readonly counts: { [id: number]: number } = {};
  // Need 2 maps because DictionaryEntry can't be a key of a map.
  // (dictionary entry id)->(dictionaryEntry)
  private entries: { [id: number]: DictionaryEntry } = {};
  private totalApparances = 0;

  registerMatch(dictionaryEntry: DictionaryEntry): void {
    let oldCount = this.counts[dictionaryEntry.id];
    if (oldCount) {
      this.counts[dictionaryEntry.id] = oldCount + 1;
    } else {
      this.counts[dictionaryEntry.id] = 1;
      this.entries[dictionaryEntry.id] = dictionaryEntry;
    }
    this.totalApparances++;
  }

  /**
   * Returns a list of (dictionary entry, number of appearances) stats.
   */
  get wordAppearanceStats(): Array<WordAppeances> {
    let counts = this.counts;
    let entries = this.entries;
    return Object.keys(this.entries).map((id): WordAppeances => {
      return {
        count: counts[parseInt(id)],
        dictionaryEntry: entries[parseInt(id)],
      };
    });
  }

  /**
   * Total number of dictionary words appearing on the page.
   */
  get totalAppearedWords(): number {
    return Object.keys(this.entries).length;
  }

  /**
   * Total number number of dictionary word appearances on the page.
   */
  get totalAppearances(): number {
    return this.totalApparances;
  }
}
