///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../src/lib/content.ts" />
///<reference path="../src/lib/settings.ts" />

describe('content', function() {
    let rootElement;
    let content: Content;
    let settings: Settings;
    let domTraversal: DomTraversal;
    let highlightInjector: HighlightInjector;
    let matchFinder: MatchFinder;

    let matchResult1: Array<MatchResultEntry>;
    let matchResult2: Array<MatchResultEntry>;

    beforeEach(function() {
        rootElement = document.createElement('div');
        rootElement.innerHTML = '<span>Child 1</span><span>Child 2</span>';
        settings = new Settings();
        settings.enableHighlighting = true;
        settings.timeout = 123;
        domTraversal = new DomTraversal();
        highlightInjector = {
            inject(textNode: Node, matchResult: Array<MatchResultEntry>) {
            }
        };
        spyOn(highlightInjector, 'inject');
        matchResult1 = [];
        matchResult2 = [];
        matchFinder = {
            findMatches(input: string): Array<MatchResultEntry> {
                if (input === 'Child 1') {
                    return matchResult1;
                }
                if (input === 'Child 2') {
                    return matchResult2;
                }
                return null;
            }
        };

        content = new Content(settings, domTraversal, highlightInjector, matchFinder);
        content.isTimeout = function() {
            return false;
        };
    });

    describe('processDocument', function() {
        describe('highlighting is enabled', function() {
            beforeEach(function() {
                settings.enableHighlighting = true;
                content.processDocument(rootElement);
            });

            it('injects markup', function() {
                expect(highlightInjector.inject).toHaveBeenCalledWith(jasmine.any(Object), matchResult1); // TODO: verify actual text value
                expect(highlightInjector.inject).toHaveBeenCalledWith(jasmine.any(Object), matchResult2);
            });
        });

        describe('highlighting is disabled', function() {
            beforeEach(function() {
                settings.enableHighlighting = false;
                content.processDocument(rootElement);
            });

            it('does not inject markup', function() {
                expect(highlightInjector.inject).not.toHaveBeenCalled();
            });
        });

        describe('initializing time', function() {
            beforeEach(function() {
                content.processDocument(rootElement);
            });

            it('initializes time', function() {
                expect(content.startTime).not.toBeNull();
            });
        });
    });

    describe('timeout', function() {
        beforeEach(function() {
            content.isTimeout = function() {
                return true;
            };
            settings.enableHighlighting = true;
            content.processDocument(rootElement);
        });

        it('does not inject markup', function() {
            expect(highlightInjector.inject).toHaveBeenCalledTimes(1); // not 2!
        });
    });
});
