///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../src/lib/content.ts" />
///<reference path="../src/lib/settings.ts" />

// This is not a "unit" but rather an integration test,
// verifying the highlighting functionality end-to-end.
// Most dependencies are not stubbed.
describe('content', function() {
    let content: Content;
    let settings: Settings;

    // jasmine.getFixtures() is added by jasmine-jquery and is not in the type definition.
    // Using this "any" variable to suppress compiler warnings.
    let j: any = jasmine;

    beforeEach(function() {
        j.getFixtures().fixturesPath = 'base/spec/fixtures';
    });

    describe('processDocument', function() {
        function parseDocument(path: string): Document {
            return new DOMParser().parseFromString(readFixture(path), 'application/xml');
        }

        function readFixture(path: string): string {
            return j.getFixtures().read(path);
        }

        function createDictionary(words: Array<string>): Array<DictionaryEntry> {
            let dictionary = [];
            for (let i = 0; i < words.length; ++i) {
                dictionary.push(new DictionaryEntry(i + 1, words[i], words[i] + ' - description', new Date(), new Date()));
            }
            return dictionary;
        }

        beforeEach(function() {
            settings = new Settings();
            settings.enableHighlighting = true;
            settings.timeout = 123;

            let highlightGenerator = new HighlightGenerator();
            // Stubbing the generator to make tests independent of the actual markup format
            // which can change fairly often.
            highlightGenerator.generate = function(word: string, dictionaryEntry: DictionaryEntry) {
                // If we don't set xmlns, it'll generate one automatically.
                // Setting it empty makes it easier to compare.
                return '<span xmlns="">' + word + '<div xmlns="">Description: ' + dictionaryEntry.description + '</div></span>';
            };
            let highlightInjector = new HighlightInjectorImpl(highlightGenerator);

            let wnd: any = window;
            let stemmer: Stemmer = wnd.stemmer;
            let matchFinder = new MatchFinderImpl(createDictionary(['people', 'profit']), stemmer);
            let domTraversal = new DomTraversal();

            content = new Content(settings, domTraversal, highlightInjector, matchFinder);
        });

        function doTest(testName: string) {
            let doc = parseDocument('content-test-' + testName + '-input.html');
            let expectedOutput = readFixture('content-test-' + testName + '-expected.html');
            content.processDocument(doc);
            let actualOutput = new XMLSerializer().serializeToString(doc.documentElement);
            expect(actualOutput).toEqual(expectedOutput);
        }

        it('injects highlights', () => {
            doTest('basic');
        });

        it('ignores blacklisted elements', () => {
            doTest('blacklisting');
        });

        it('does not highlight anything is highlighting is disabled', () => {
            settings.enableHighlighting = false;
            doTest('disabled');
        });

        it('highlights only the first word if it times out immediately', () => {
            content.isTimeout = function() {
                return true;
            };
            doTest('timeout');
        });
    });
});
