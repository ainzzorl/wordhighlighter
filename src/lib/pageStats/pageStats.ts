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
  readonly counts: Map<number, number> = new Map<number, number>();
  // Need 2 maps because DictionaryEntry can't be a key of a map.
  // (dictionary entry id)->(dictionaryEntry)
  private entries: Map<number, DictionaryEntry> = new Map<
    number,
    DictionaryEntry
  >();
  private totalApparances = 0;

  registerMatch(dictionaryEntry: DictionaryEntry): void {
    let oldCount = this.counts.get(dictionaryEntry.id);
    if (oldCount) {
      this.counts.set(dictionaryEntry.id, oldCount + 1);
    } else {
      this.counts.set(dictionaryEntry.id, 1);
      this.entries.set(dictionaryEntry.id, dictionaryEntry);
    }
    this.totalApparances++;
  }

  /**
   * Returns a list of (dictionary entry, number of appearances) stats.
   */
  get wordAppearanceStats(): Array<WordAppeances> {
    let counts = this.counts;
    let entries = this.entries;
    return Array.from(this.entries.keys()).map((id): WordAppeances => {
      return {
        count: counts.get(id),
        dictionaryEntry: entries.get(id),
      };
    });
  }

  /**
   * Total number of dictionary words appearing on the page.
   */
  get totalAppearedWords(): number {
    return this.entries.size;
  }

  /**
   * Total number number of dictionary word appearances on the page.
   */
  get totalAppearances(): number {
    return this.totalApparances;
  }
}
