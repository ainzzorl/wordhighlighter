/**
 * Class responsible for traversing DOM objects and finding text nodes eligible for highlight injection.
 */
class DomTraversal {
  private stopped = false;

  private readonly BLACKLISTED_TAGS: any = {
    SCRIPT: true,
    NOSCRIPT: true,
    STYLE: true,
    TITLE: true,
  };

  private readonly BLACKLISTED_IDS: any = {
    // Generated stats - it should't highlight there.
    'word-highlighter-per-word-stats': true,
  };

  //
  private readonly BLACKLISTED_CLASSES: any = {
    // Already highlighted.
    'highlighted-word': true,
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
    if (tagName && this.BLACKLISTED_TAGS[tagName.toUpperCase()]) {
      return true;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      let element = node as Element;

      if (
        this.getClasses(element).filter(
          (clazz) => this.BLACKLISTED_CLASSES[clazz]
        ).length
      ) {
        return true;
      }

      if (this.BLACKLISTED_IDS[element.id]) {
        return true;
      }
    }
    return false;
  }

  private getClasses(element: Element): Array<string> {
    let classes: Array<string> = [];
    let classList: any = element.classList;
    // Using "forEach" seems a lot more reasonable,
    // but for some reason it's not available here when testing with PhantomJS.
    //  ¯\_(ツ)_/¯
    for (let i = 0; i < classList.length; i++) {
      classes.push(classList[i]);
    }

    return classes;
  }
}
