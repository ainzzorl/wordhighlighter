///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../src/lib/Content.ts" />

describe('content', function() {
    let textNodeHandler: TextNodeHandler;
    let rootElement;
    let content;

    beforeEach(function() {
        textNodeHandler = new TextNodeHandler(null);
        rootElement = document.createElement('div');
        content = new Content(textNodeHandler);

        textNodeHandler.injectMarkup = function(node: Node): Array<HTMLElement> {
            if (node.textContent === 'Replaced with 2') {
                return [
                    createSpan('span1'),
                    createSpan('span2')
                ];
            }
            if (node.textContent === 'Does not match') {
                return null;
            }
            return [];
        }
    });

    describe('one text node', function() {
        describe('match', function() {
            beforeEach(function() {
                rootElement.innerHTML = '<child>Replaced with 2</child>';
                content.injectMarkup(rootElement);
            });

            it('marks up the text', function() {
                expect(rootElement.innerHTML).toEqual(
                    '<child><span>span1</span><span>span2</span></child>');
            });
        })

        describe('no match', function() {
            beforeEach(function() {
                rootElement.innerHTML = '<child>Does not match</child>';
                content.injectMarkup(rootElement);
            });

            it('does not do anything', function() {
                expect(rootElement.innerHTML).toEqual(
                    '<child>Does not match</child>');
            });
        })
    });

    function createSpan(value) {
        let span = document.createElement('span');
        span.innerHTML = value;
        return span;
    }
});
