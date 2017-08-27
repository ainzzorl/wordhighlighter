///<reference path="./dom/highlightInjector.ts" />
///<reference path="./dom/domTraversal.ts" />
///<reference path="./dom/pageStatsInfoGenerator.ts" />
///<reference path="./matching/matchFinder.ts" />
///<reference path="common/logger.ts" />
///<reference path="common/settings.ts" />
///<reference path="stats/pageStats.ts" />

/**
 * Implements content script logic: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Content_scripts
 */
class Content {
    private startTime: number;

    private settings: Settings;
    private domTraversal: DomTraversal = new DomTraversal();
    private highlightInjector: HighlightInjector;
    private matchFinder: MatchFinder;
    private pageStatsInfoGenerator: PageStatsInfoGenerator = new PageStatsInfoGenerator();
    private pageStats: PageStats = new PageStats();

    constructor(settings: Settings, highlightInjector: HighlightInjector, matchFinder: MatchFinder) {
        this.settings = settings;
        this.highlightInjector = highlightInjector;
        this.matchFinder = matchFinder;
    }

    processDocument(doc: Document): void {
        if (!this.settings.enableHighlighting) {
            return;
        }
        this.startTime = performance.now();
        let content: Content = this;
        this.domTraversal.traverseEligibleTextNodes(
            doc,
            function(node: Text) {
                content.onFound(content, node);
            },
            function() {
                content.onFinished(content, doc);
            }
        );
    }

    private isTimeout(): boolean {
        let now = performance.now();
        let seconds = (now - this.startTime) / 1000;
        return seconds > this.settings.timeout;
    }

    private onFound(content: Content, node: Text): void {
        if (content.isTimeout()) {
            WHLogger.log('Terminating because of the timeout');
            content.domTraversal.stop();
            return;
        }
        let matches = content.matchFinder.findMatches(node.textContent);
        content.highlightInjector.inject(node, matches);
        matches
            .filter((match: MatchResultEntry) => match.matchOf)
            .forEach((match: MatchResultEntry) => this.pageStats.registerMatch(match.matchOf));
    }

    private onFinished(content: Content, doc: Document): void {
        if (content.settings.enablePageStats && content.pageStats.totalAppearances > 0) {
            this.injectPageStatsInfo(content, doc);
            this.addEventListeners(doc);
        }
    }

    private injectPageStatsInfo(content: Content, doc: Document): void {
        // Injecting the stats to the body.
        // Can't simply use doc.body because documents used in unit tests are XML, not HTML,
        // and they don't have body.
        // The reason they are XML is that DOMParser doesn't seem to support HTML in PhantomJS.
        let bodyNodes = doc.getElementsByTagName('body');
        for (let i = 0; i < bodyNodes.length; ++i) {
            bodyNodes[i].appendChild(content.pageStatsInfoGenerator.generate(content.pageStats));
        }
    }

    // TODO: unit test
    private addEventListeners(doc: Document): void {
        for (let element of <Node[]><any>doc.querySelectorAll('#word-highlighter-page-stats a')) {
            element.addEventListener('click', () => { this.expandPageStats(doc); }, true);
        }
        doc.getElementById('word-highlighter-page-stats-close').addEventListener('click', () => {
            this.dismissPageStats(doc);
        });
    }

    private expandPageStats(doc: Document): void {
        doc.getElementById('word-highlighter-per-word-stats').style.display = 'block';
    }

    private dismissPageStats(doc: Document): void {
        doc.getElementById('word-highlighter-page-stats').style.display = 'none';
    }
}
