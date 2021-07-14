///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/dom/domTraversal.ts" />

describe('DomTraversal', () => {
  let domTraversal: DomTraversal;
  let rootNode: HTMLElement;

  beforeEach(() => {
    rootNode = document.createElement('div');
    rootNode.innerHTML = `<child>
                                <not-blacklisted>Result 1</not-blacklisted>
                                <script>Blacklisted</script>
                                <div>
                                    <span>Result 2</span>
                                </div>
                                <div>
                                    <span class="highlighted-word some-other-class">Already highlighted</span>
                                </div>
                                <div id="word-highlighter-per-word-stats">
                                    <span>In page stats</span>
                                </div>
                            </child>`;
    domTraversal = new DomTraversal();
  });

  describe('traverseEligibleTextNodes', () => {
    let result: Array<string>;
    let finished = false;

    beforeEach(() => {
      result = [];
      domTraversal.traverseEligibleTextNodes(
        rootNode,
        (text: Text) => {
          result.push(text.textContent);
        },
        () => {
          finished = true;
        }
      );
    });

    it('finishes', () => {
      expect(finished).toBe(true);
    });

    it('traverses eligible text nodes', () => {
      expect(result).toEqual(['Result 1', 'Result 2']);
    });
  });
});
