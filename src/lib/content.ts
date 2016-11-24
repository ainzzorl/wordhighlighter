///<reference path="textNodeHandler.ts" />

class Content {
    private BLACKLISTED_TAGS: any = {
        'SCRIPT': true,
        'STYLE': true,
        'TITLE': true
    };

    textNodeHandler: TextNodeHandler;

    constructor(textNodeHandler: TextNodeHandler) {
        this.textNodeHandler = textNodeHandler;
    }

    injectMarkup(node: Node): void {
        if (this.isBlacklisted(node)) {
            return;
        }
        let child = node.firstChild;
        while (child) {
            if (child.nodeType === Node.TEXT_NODE) {
                let replacement = this.textNodeHandler.injectMarkup(child);
                if (replacement) {
                    for (var i = 0; i < replacement.length; ++i) {
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

    private isBlacklisted(node: Node): void {
        return this.BLACKLISTED_TAGS[(<HTMLElement>node).tagName];
    }
}