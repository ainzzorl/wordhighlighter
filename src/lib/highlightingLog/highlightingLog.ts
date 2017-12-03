///<reference path="highlightingLogEntry.ts" />
///<reference path="../pageStats/pageStats.ts" />

/**
 * Log of highlights. Powers "History" tab.
 * One entry = 1 page load with highlights.
 */
class HighlightingLog {
    readonly entries: Array<HighlightingLogEntry>;

    constructor(entries: Array<HighlightingLogEntry> = []) {
        this.entries = entries;
    }

    log(pageStats: PageStats): void {
        this.entries.push(new HighlightingLogEntry(window.location.href, new Date(), pageStats.counts));
    }
}
