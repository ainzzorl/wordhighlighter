///<reference path="highlightingLogEntry.ts" />
///<reference path="../pageStats/pageStats.ts" />

/**
 * Log of highlights. Powers "History" tab.
 * One entry = 1 page load with highlights.
 */
class HighlightingLog {
    readonly entries: Array<HighlightingLogEntry>;

    // We limit the number of entries in the log
    // to reduce the risk of exceeding the storage limit.
    // It'd be better to evict entries only when it starts erroring out,
    // but it's also trickier because the error can happen when saving some other objects
    // such as dictionary or settings.
    private readonly LIMIT = 100 * 1000;

    constructor(entries: Array<HighlightingLogEntry> = []) {
        this.entries = entries;
    }

    log(pageStats: PageStats): void {
        this.entries.push(new HighlightingLogEntry(window.location.href, new Date(), pageStats.counts));
        if (this.entries.length > this.LIMIT) {
            this.entries.shift();
        }
    }
}
