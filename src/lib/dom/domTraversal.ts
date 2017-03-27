class DomTraversal {
    private stopped = false;

    private BLACKLISTED_TAGS: any = {
        'SCRIPT': true,
        'NOSCRIPT': true,
        'STYLE': true,
        'TITLE': true
    };

    traverseEligibleTextNodes(root: Node, onFound: (node: Text) => void, onFinished: () => void): void {
        this.traverse(root, onFound);
        onFinished();
    }

    stop(): void {
        this.stopped = true;
    }

    private traverse(node: Node, onFound: (node: Text) => void): void {
        if (this.stopped || this.isBlacklisted(node)) {
            return;
        }
        let child = node.firstChild;
        while (child) {
            if (child.nodeType === Node.TEXT_NODE) {
                onFound(<Text>node);
            } else {
                this.traverse(child, onFound);
            }
            child = child.nextSibling;
        }
    }

    private isBlacklisted(node: Node): void {
        return this.BLACKLISTED_TAGS[(<HTMLElement>node).tagName];
    }
}
