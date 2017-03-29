/**
 * Class responsible for traversing DOM objects and finding eligible nodes.
 */
class DomTraversal {
    private stopped = false;

    private BLACKLISTED_TAGS: any = {
        'SCRIPT': true,
        'NOSCRIPT': true,
        'STYLE': true,
        'TITLE': true
    };

    /**
     * Find text nodes eligible for injecting markup.
     * @param root The root node.
     * @param onFound Callback called when an eligible node is found.
     * @param onFinished Callback called once the traversal has finished.
     */
    traverseEligibleTextNodes(root: Node, onFound: (node: Text) => void, onFinished: () => void): void {
        this.traverse(root, onFound, onFinished);
        onFinished();
    }

    /**
     * Stops the traversal.
     * Called when it's out of allocated time.
     */
    stop(): void {
        this.stopped = true;
    }

    private traverse(node: Node, onFound: (node: Text) => void, onFinished: () => void): void {
        if (this.stopped || this.isBlacklisted(node)) {
            onFinished();
            return;
        }
        let child = node.firstChild;
        while (child) {
            if (child.nodeType === Node.TEXT_NODE) {
                onFound(<Text>child);
            } else {
                this.traverse(child, onFound, onFinished);
            }
            child = child.nextSibling;
        }
    }

    private isBlacklisted(node: Node): boolean {
        let tagName = (<HTMLElement>node).tagName;
        if (tagName) {
            return this.BLACKLISTED_TAGS[tagName.toUpperCase()];
        } else {
            return false;
        }
    }
}
