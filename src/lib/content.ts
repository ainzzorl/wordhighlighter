///<reference path="./dom/highlightInjector.ts" />
///<reference path="./dom/domTraversal.ts" />
///<reference path="./matching/matchFinder.ts" />
///<reference path="common/logger.ts" />
///<reference path="common/settings.ts" />

/**
 * Implements content script logic: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Content_scripts
 */
class Content {
    private startTime: number;

    private settings: Settings;
    private domTraversal: DomTraversal;
    private highlightInjector: HighlightInjector;
    private matchFinder: MatchFinder;

    constructor(settings: Settings, domTraversal: DomTraversal, highlightInjector: HighlightInjector, matchFinder: MatchFinder) {
        this.settings = settings;
        this.domTraversal = domTraversal;
        this.highlightInjector = highlightInjector;
        this.matchFinder = matchFinder;
    }

    processDocument(root: Node): void {
        if (!this.settings.enableHighlighting) {
            return;
        }
        this.startTime = performance.now();
        let content: Content = this;
        this.domTraversal.traverseEligibleTextNodes(
            root,
            function(node: Text) {
                content.onFound(content, node);
            },
            this.onFinished
        );
    }

    private isTimeout(): boolean {
        let now = performance.now();
        let seconds = (now - this.startTime) / 1000;
        return seconds > this.settings.timeout;
    }

    private onFound(content: Content, node: Text): void {
        content.highlightInjector.inject(node, content.matchFinder.findMatches(node.textContent));
        if (content.isTimeout()) {
            WHLogger.log('Terminating because of the timeout');
            content.domTraversal.stop();
        }
    }

    private onFinished(): void {
    }
}
