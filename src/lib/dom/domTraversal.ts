/**
 * Class responsible for traversing DOM objects and finding text nodes eligible for highlight injection.
 */
class DomTraversal {
  private stopped = false;

  private BLACKLISTED_TAGS: any = {
    SCRIPT: true,
    NOSCRIPT: true,
    STYLE: true,
    TITLE: true,
  };

  /**
   * Find text nodes eligible for injecting markup.
   * @param root The root node.
   * @param onFound Callback called when an eligible node is found.
   * @param onFinished Callback called once the traversal has finished.
   */
  traverseEligibleTextNodes(
    root: Node,
    onFound: (node: Text) => void,
    onFinished: () => void
  ): void {
    this.traverse(root, onFound);
    onFinished();
  }

  /**
   * Stops the traversal.
   * Called when it's out of allocated time.
   */
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
        let textNode = <Text>child;
        if (textNode.textContent.trim().length > 0) {
          onFound(textNode);
        }
      } else {
        this.traverse(child, onFound);
      }
      child = child.nextSibling;
    }
  }

  private isBlacklisted(node: Node): boolean {
    let tagName = (<HTMLElement>node).tagName;
    return tagName && this.BLACKLISTED_TAGS[tagName.toUpperCase()];
  }
}
