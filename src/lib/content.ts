///<reference path="./dom/highlightInjector.ts" />
///<reference path="./dom/domTraversal.ts" />
///<reference path="./dom/pageStatsInfoGenerator.ts" />
///<reference path="./matching/matchFinder.ts" />
///<reference path="common/dao.ts" />
///<reference path="common/logger.ts" />
///<reference path="common/settings.ts" />
///<reference path="highlightingLog/highlightingLog.ts" />
///<reference path="highlightingLog/highlightingLogEntry.ts" />
///<reference path="pageStats/pageStats.ts" />

/**
 * Implements content script logic: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Content_scripts
 */
class Content {
  private startTime: number;

  private dao: DAO;
  private settings: Settings;
  private domTraversal: DomTraversal = new DomTraversal();
  private highlightInjector: HighlightInjector;
  private matchFinder: MatchFinder;
  private highlightingLog: HighlightingLog;
  private pageStatsInfoGenerator: PageStatsInfoGenerator =
    new PageStatsInfoGenerator();
  private pageStats: PageStats = new PageStats();
  private remainingTimeBudgetSeconds: number;

  constructor(
    dao: DAO,
    settings: Settings,
    highlightInjector: HighlightInjector,
    matchFinder: MatchFinder,
    highlightingLog: HighlightingLog
  ) {
    this.dao = dao;
    this.settings = settings;
    this.highlightInjector = highlightInjector;
    this.matchFinder = matchFinder;
    this.highlightingLog = highlightingLog;
    this.remainingTimeBudgetSeconds = settings.timeout;
  }

  async processDocument(doc: Document) {
    if (!this.settings.enableHighlighting) {
      return;
    }
    this.matchFinder.buildIndexes();
    this.processNode(doc, true);
  }

  async processNode(root: Node, onRootDocument: boolean = false) {
    if (!this.settings.enableHighlighting) {
      return;
    }
    this.startTime = performance.now();
    let content: Content = this;
    return new Promise<void>((resolve, _reject) => {
      this.domTraversal.traverseEligibleTextNodes(
        root,
        function (node: Text) {
          content.onFound(content, node);
        },
        function () {
          content.remainingTimeBudgetSeconds -= content.elapsedSeconds();
          content.matchFinder.cleanup();
          if (onRootDocument) {
            content.onFinished(content, root as Document).then(resolve);
          }
        }
      );
    });
  }

  private isTimeout(): boolean {
    return this.elapsedSeconds() > this.remainingTimeBudgetSeconds;
  }

  private elapsedSeconds(): number {
    let now = performance.now();
    return (now - this.startTime) / 1000;
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
      .forEach((match: MatchResultEntry) =>
        this.pageStats.registerMatch(match.matchOf)
      );
  }

  private async onFinished(content: Content, doc: Document) {
    if (content.pageStats.totalAppearances > 0) {
      if (content.settings.enablePageStats) {
        this.injectPageStatsInfo(content, doc);
        this.addEventListeners(doc);
      }
      this.highlightingLog.log(content.pageStats);
      await this.dao.saveHighlightingLog(this.highlightingLog);
    }
  }

  private injectPageStatsInfo(content: Content, doc: Document): void {
    // Injecting the stats to the body.
    // Can't simply use doc.body because documents used in unit tests are XML, not HTML,
    // and they don't have body.
    // The reason they are XML is that DOMParser doesn't seem to support HTML in PhantomJS.
    let bodyNodes = doc.getElementsByTagName('body');
    for (let i = 0; i < bodyNodes.length; ++i) {
      bodyNodes[i].appendChild(
        content.pageStatsInfoGenerator.generate(content.pageStats)
      );
    }
  }

  // TODO: unit test
  private addEventListeners(doc: Document): void {
    for (let element of <Node[]>(
      (<any>doc.querySelectorAll('#word-highlighter-page-stats a'))
    )) {
      element.addEventListener(
        'click',
        () => {
          this.expandPageStats(doc);
        },
        true
      );
    }
    doc
      .getElementById('word-highlighter-page-stats-close')
      .addEventListener('click', () => {
        this.dismissPageStats(doc);
      });
  }

  private expandPageStats(doc: Document): void {
    doc.getElementById('word-highlighter-per-word-stats').style.display =
      'block';
  }

  private dismissPageStats(doc: Document): void {
    doc.getElementById('word-highlighter-page-stats').style.display = 'none';
  }
}
