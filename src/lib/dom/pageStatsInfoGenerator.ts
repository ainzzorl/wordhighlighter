///<reference path="../common/dictionaryEntry.ts" />
///<reference path="../stats/pageStats.ts" />

/**
 * Class responsible for generating page stats info (displayed in the right bottom corner).
 * There's no spec for this class: it's pure presentation.
 */
class PageStatsInfoGenerator {
    /**
     * Generate HTML showing stats about words found on the page.
     * @param stats Page stats.
     */
    generate(stats: PageStats): HTMLElement {
        let html = '<div id="word-highlighter-page-stats"><p>Word Highlighter Page Statistics</p></div>';
        let result = document.createElement('div');
        result.innerHTML = html;
        return result;
    }
}
