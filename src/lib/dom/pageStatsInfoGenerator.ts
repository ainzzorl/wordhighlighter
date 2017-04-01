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
        html += this.generateAggregates(stats);
        html += this.generatePerWordDetails(stats);
        html += '</div>';
        let result = document.createElement('div');
        result.innerHTML = html;
        return result;
    }

    private generatePerWordDetails(stats: PageStats): string {
        return '<div>'
            + stats.getWordAppearanceStats()
                .sort((a1, a2) => { return a2.count - a1.count; })
                .reduce(
                    (acc, wordStats) => {
                        return acc + '<p>' + wordStats.dictionaryEntry.value + ':' + wordStats.count + '</p>';
                    },
                    '')
            + '</div>';
    }

    private generateAggregates(stats: PageStats): string {
        return '<div>'
            + '<p>Unique matching words: ' + stats.getTotalAppearedWords() + '</p>'
            + '<p>Total matches: ' + stats.getTotalAppearances() + '</p>'
            + '</div>';
    }
}
