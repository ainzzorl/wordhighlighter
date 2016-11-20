///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../src/lib/Content.ts" />

describe('content', function() {
    let textNodeHandler: TextNodeHandler;

    describe('start', function() {
        let rootElement;

        beforeEach(function() {
            let textNodeHandler = new TextNodeHandler(null);
            textNodeHandler.injectMarkup = function(node: Node): Array<HTMLElement> {
                if (node.textContent === 'Replaced with 2') {
                    return [
                        createSpan('span1'),
                        createSpan('span2')
                    ];
                }
                return null;
            }
            rootElement = document.createElement('div');
            rootElement.innerHTML = '<child>Replaced with 2</child>';
            document.body.appendChild(rootElement);

            let content = new Content(textNodeHandler);
            content.injectMarkup(rootElement);
        });

        it('marks up the node', function() {
            expect(rootElement.innerHTML).toEqual(
                '<child><span>span1</span><span>span2</span></child>');
        });
    });

    function createSpan(value) {
        let span = document.createElement('span');
        span.innerHTML = value;
        return span;
    }
});
