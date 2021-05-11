///<reference path="./highlightGenerator.ts" />
///<reference path="../matching/matchResultEntry.ts" />

/**
 * Injects highlights in place of text nodes based on matching results.
 */
interface HighlightInjector {
  /**
   * Inject highlights.
   * @param textNode Text node to replace.
   * @param matchResults Match results for the text node.
   */
  inject(textNode: Node, matchResult: Array<MatchResultEntry>): void;
}

class HighlightInjectorImpl implements HighlightInjector {
  private highlightGenerator: HighlightGenerator;

  constructor(highlightGenerator: HighlightGenerator) {
    this.highlightGenerator = highlightGenerator;
  }

  inject(textNode: Node, matchResults: Array<MatchResultEntry>): void {
    if (matchResults.length === 1 && !matchResults[0].matchOf) {
      // No matches. Nothing will change if we don't exit here,
      // but it's likely to be much slower.
      return;
    }

    let replacementNodes = this.getReplacementNodes(matchResults);
    for (let i = 0; i < replacementNodes.length; ++i) {
      textNode.parentNode.insertBefore(replacementNodes[i], textNode);
    }
    textNode.parentNode.removeChild(textNode);
  }

  private getReplacementNodes(
    matchResults: Array<MatchResultEntry>
  ): Array<HTMLElement> {
    let html = '';
    for (let i = 0; i < matchResults.length; ++i) {
      if (matchResults[i].matchOf) {
        html += this.highlightGenerator.generate(
          matchResults[i].value,
          matchResults[i].matchOf
        );
      } else {
        html += matchResults[i].value;
      }
    }
    let newNode = document.createElement('doesnotmatter');
    newNode.innerHTML = html;
    return Array.prototype.slice.call(newNode.childNodes);
  }
}
