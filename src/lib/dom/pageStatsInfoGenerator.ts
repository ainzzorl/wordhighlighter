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
        let html = '<div id="word-highlighter-page-stats">';
        html += this.generateCloseButton();
        html += this.generateAggregates(stats);
        html += this.generatePerWordDetails(stats);
        html += this.generateTip();
        html += '</div>';
        let result = document.createElement('div');
        result.innerHTML = html;
        return result;
    }

    private generatePerWordDetails(stats: PageStats): string {
        return '<div id="word-highlighter-per-word-stats">'
            + stats.getWordAppearanceStats()
                .sort((a1, a2) => { return a2.count - a1.count; })
                .reduce(
                    (acc, wordStats) => {
                        return acc + '<div>'
                            + '<div class="word-highlighter-per-word-stats-value">' + wordStats.dictionaryEntry.value + '</div>'
                            + '<div class="word-highlighter-per-word-stats-count">' + wordStats.count + '</div>'
                            + '</div>';
                    },
                    '')
            + '</div>';
    }

    private generateAggregates(stats: PageStats): string {
        return '<div onclick="document.getElementById(\'word-highlighter-per-word-stats\').style.display = \'block\'">'
            + '<p class="word-highlighter-page-stats-header">Highlighted</p>'
            + '<p><span class="word-highlighter-stats-aggregate">' + stats.getTotalAppearedWords() + '</span> words</p>'
            + '<p><span class="word-highlighter-stats-aggregate">' + stats.getTotalAppearances() + '</span> times</p>'
            + '</div>';
    }

    private generateCloseButton(): string {
        return '<span id="word-highlighter-page-stats-close"'
            + ' onclick="document.getElementById(\'word-highlighter-page-stats\').style.display = \'none\'">x</span>';
    }

    private generateTip(): string {
        return '<div id="word-highlighter-page-stats-tip">Tip: you can disable this popup in settings.</div>';
    }
}
