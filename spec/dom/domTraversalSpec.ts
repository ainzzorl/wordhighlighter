///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/dom/domTraversal.ts" />

// TODO: test stopping.
describe('DomTraversal', function() {
    let domTraversal: DomTraversal;
    let rootNode: HTMLElement;

    beforeEach(function() {
        rootNode = document.createElement('div');
        rootNode.innerHTML = '<child>'
                + '<not-blacklisted>Result 1</not-blacklisted>'
                + '<script>Blacklisted</script>'
                + '<div><span>Result 2</span></div>'
                + '</child>';
        domTraversal = new DomTraversal();
    });

    describe('traverseEligibleTextNodes', function() {
        let result: Array<string>;
        let finished = false;

        beforeEach(function() {
            result = [];
            domTraversal.traverseEligibleTextNodes(
                rootNode,
                function(text: Text) {
                    result.push(text.textContent);
                },
                function() {
                    finished = true;
                }
            );
        });

        it('finishes', function() {
            expect(finished).toBe(true);
        });

        it('traverses eligible text nodes', function() {
            expect(result).toEqual(['Result 1', 'Result 2']);
        });
    });
});
