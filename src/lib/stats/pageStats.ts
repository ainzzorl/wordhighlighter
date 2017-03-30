interface WordAppeances {
    dictionaryEntry: DictionaryEntry;
    count: number;
}

/**
 * Statistics about a page load.
 */
class PageStats {
    // Need 2 maps because DictionaryEntry can't be a key of a map.
    // (dictionary entry id)->(dictionaryEntry)
    private entries: { [id: number]: DictionaryEntry; } = {};
    // (dictionary entry id)->(number of appearances)
    private counts: { [id: number]: number; } = {};
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
    getWordAppearanceStats(): Array<WordAppeances> {
        let counts = this.counts;
        let entries = this.entries;
        return Object.keys(this.entries)
            .map((id): WordAppeances => {
                return {
                    count: counts[parseInt(id)],
                    dictionaryEntry: entries[parseInt(id)]
                };
            });
    }

    /**
     * Total number of dictionary words appearing on the page.
     */
    getTotalAppearedWords(): number {
        return Object.keys(this.entries).length;
    }

    /**
     * Total number number of dictionary word appearances on the page.
     */
    getTotalAppearances(): number {
        return this.totalApparances;
    }
}
