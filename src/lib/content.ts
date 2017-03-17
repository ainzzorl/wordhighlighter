///<reference path="logger.ts" />
///<reference path="textNodeHandler.ts" />

/**
 * Implements content script logic: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Content_scripts
 */
class Content {
    private BLACKLISTED_TAGS: any = {
        'SCRIPT': true,
        'NOSCRIPT': true,
        'STYLE': true,
        'TITLE': true
    };

    private textNodeHandler: TextNodeHandler;
    private settings: Settings;
    startTime: number; // TODO: must be private

    constructor(textNodeHandler: TextNodeHandler, settings: Settings) {
        this.textNodeHandler = textNodeHandler;
        this.settings = settings;
    }

    processDocument(document: Document): void {
        if (this.settings.enableHighlighting) {
            this.startTime = performance.now();
            this.injectMarkup(document);
        }
    }

    injectMarkup(node: Node): void {
        if (this.isTimeout()) {
            WHLogger.log('Terminating because of the timeout');
            return;
        }
        if (this.isBlacklisted(node)) {
            return;
        }
        let child = node.firstChild;
        while (child) {
            if (child.nodeType === Node.TEXT_NODE) {
                let replacement = this.textNodeHandler.injectMarkup(child);
                if (replacement) {
                    for (let i = 0; i < replacement.length; ++i) {
                        node.insertBefore(replacement[i], child);
                    }
                    let next = child.nextSibling;
                    node.removeChild(child);
                    child = next;
                    continue;
                }
            } else {
                this.injectMarkup(child);
            }
            child = <HTMLElement> child.nextSibling;
        }
    }

    isTimeout(): boolean {
        let now = performance.now();
        let seconds = (now - this.startTime) / 1000;
        return seconds > this.settings.timeout;
    }

    private isBlacklisted(node: Node): void {
        return this.BLACKLISTED_TAGS[(<HTMLElement>node).tagName];
    }
}
