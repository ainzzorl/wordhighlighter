///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../src/lib/content.ts" />
///<reference path="../src/lib/common/settings.ts" />

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
        let matchFinder: MatchFinder;
        let highlightInjector: HighlightInjector;
        let highlightGenerator: HighlightGenerator;

        beforeEach(() => {
            settings = new Settings();
            let wnd: any = window;
            let stemmer: Stemmer = wnd.stemmer;
            highlightGenerator = new HighlightGenerator();
            matchFinder = new MatchFinderImpl(createDictionary(['people', 'profit']), stemmer);
            highlightInjector = new HighlightInjectorImpl(highlightGenerator);
            content = new Content(settings, highlightInjector, matchFinder);
        });

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

        function doTest(testName: string) {
            let doc = parseDocument('content-test-' + testName + '-input.html');
            let expectedOutput = readFixture('content-test-' + testName + '-expected.html');
            content.processDocument(doc);
            let actualOutput = new XMLSerializer().serializeToString(doc.documentElement);
            expect(actualOutput).toEqual(expectedOutput);
        }

        describe('highlighting', () => {
            beforeEach(function() {
                settings.enableHighlighting = true;
                settings.enablePageStats = false;
                settings.timeout = 123;

                // Stubbing the generator to make tests independent of the actual markup format
                // which can change fairly often.
                highlightGenerator.generate = function(word: string, dictionaryEntry: DictionaryEntry) {
                    // If we don't set xmlns, it'll generate one automatically.
                    // Setting it empty makes it easier to compare.
                    return '<span xmlns="">' + word + '<div xmlns="">Description: ' + dictionaryEntry.description + '</div></span>';
                };
            });

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

            it('does not highlight anything if it times out', () => {
                settings.timeout = 0;
                doTest('timeout');
            });
        });

        describe('page stats', () => {
            beforeEach(function() {
                settings.enableHighlighting = true;
                settings.enablePageStats = true;
                settings.timeout = 123;

                // Stubbing the generator to not highlight words anyhow
                // to make it easier to test stats only.
                highlightGenerator.generate = function(word: string, dictionaryEntry: DictionaryEntry) {
                    return word;
                };
            });

            it('injects page stats is anything is highlighted', () => {
                doTest('stats-present');
            });

            it('does not injects page stats if there\'s nothing to highlight', () => {
                doTest('stats-absent');
            });
        });
    });
});
