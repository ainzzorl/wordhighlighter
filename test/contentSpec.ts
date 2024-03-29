///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../src/lib/content.ts" />
///<reference path="../src/lib/common/settings.ts" />
///<reference path="../src/lib/highlightingLog/highlightingLog.ts" />

// This is not a "unit" but rather an integration test,
// verifying the highlighting functionality end-to-end.
// Most dependencies are not stubbed.
describe('content', function () {
  let content: Content;
  let settings: Settings;

  // jasmine.getFixtures() is added by jasmine-jquery and is not in the type definition.
  // Using this "any" variable to suppress compiler warnings.
  const j: any = jasmine;

  beforeEach(function () {
    j.getFixtures().fixturesPath = 'base/test/fixtures';
  });

  describe('processDocument', function () {
    let matchFinder: MatchFinder;
    let highlightInjector: HighlightInjector;
    let highlightGenerator: HighlightGenerator;
    let dao: any;
    let highlightingLog: HighlightingLog;

    beforeEach(() => {
      settings = new Settings();
      const wnd: any = window;
      const stemmers = new Map<string, Stemmer>(Object.entries(wnd.stemmers));
      const groups = [
        new Group(
          1,
          'group-name',
          'background-color',
          Group.DEFAULT_MATCHING_TYPE,
          Group.DEFAULT_MATCHING_LANGUAGE
        ),
      ];
      highlightGenerator = new HighlightGenerator(groups, Settings.DEFAULT);
      matchFinder = new MatchFinderImpl(
        createDictionary(['people', 'profit']),
        stemmers,
        groups
      );
      spyOn(matchFinder, 'buildIndexes').and.callThrough();
      spyOn(matchFinder, 'cleanup').and.callThrough();
      highlightInjector = new HighlightInjectorImpl(highlightGenerator);
      highlightingLog = new HighlightingLog([]);
      dao = {
        saveHighlightingLog(_log: Array<HighlightingLogEntry>) {
          return Promise.resolve();
        },
      };
    });

    function readFixture(path: string): string {
      return j.getFixtures().read(path);
    }

    function createDictionary(words: Array<string>): Array<DictionaryEntry> {
      const dictionary = [];
      for (let i = 0; i < words.length; ++i) {
        dictionary.push(
          new DictionaryEntry(
            i + 1,
            words[i],
            words[i] + ' - description',
            new Date(),
            new Date()
          )
        );
      }
      return dictionary;
    }

    describe('highlighting', () => {
      beforeEach(function () {
        settings.enableHighlighting = true;
        settings.enablePageStats = false;
        settings.timeout = 123;

        // Stubbing the generator to make tests independent of the actual markup format
        // which can change fairly often.
        highlightGenerator.generate = function (
          word: string,
          dictionaryEntry: DictionaryEntry
        ) {
          // If we don't set xmlns, it'll generate one automatically.
          // Setting it empty makes it easier to compare.
          return (
            '<span xmlns="">' +
            word +
            '<div xmlns="">Description: ' +
            dictionaryEntry.description +
            '</div></span>'
          );
        };
      });

      it('injects highlights', async () => {
        await doTest('basic');
      });

      it('ignores blacklisted elements', async () => {
        await doTest('blacklisting');
      });

      it('does not highlight anything and does not build indexes is highlighting is disabled', async () => {
        settings.enableHighlighting = false;
        await doTest('disabled');
        expect(matchFinder.buildIndexes).not.toHaveBeenCalled();
      });

      it('does not highlight anything if it times out', async () => {
        // Negative because when it was 0 it would occasionally not trigger timeout
        // on headless Chrome.
        settings.timeout = -1;
        await doTest('timeout');
      });
    });

    describe('page stats', () => {
      beforeEach(function () {
        settings.enableHighlighting = true;
        settings.enablePageStats = true;
        settings.timeout = 123;

        // Stubbing the generator to not highlight words anyhow
        // to make it easier to test stats only.
        highlightGenerator.generate = function (
          word: string,
          _dictionaryEntry: DictionaryEntry
        ) {
          return word;
        };
      });

      it('injects page stats is anything is highlighted', async () => {
        await doTest('stats-present');
      });

      it("does not injects page stats if there's nothing to highlight", async () => {
        await doTest('stats-absent');
      });
    });

    async function doTest(testName: string) {
      const doc = parseDocument('content-test-' + testName + '-input.html');
      content = new Content(
        dao,
        settings,
        highlightInjector,
        matchFinder,
        highlightingLog
      );
      await content.processDocument(doc);
      verifyOutput(doc, testName);
      verifyLog(doc, testName);
      if (settings.enableHighlighting) {
        expect(matchFinder.cleanup).toHaveBeenCalled();
      }
    }

    function verifyOutput(doc: Document, testName: string) {
      const expectedOutput = readFixture(
        'content-test-' + testName + '-expected.html'
      );
      const actualOutput = new XMLSerializer().serializeToString(
        doc.documentElement
      );
      expect(actualOutput).toEqual(expectedOutput);
    }

    function verifyLog(doc: Document, testName: string) {
      const expectedLog = JSON.parse(
        readFixture('content-test-' + testName + '-expected-log.json')
      );
      expectedLog.forEach((e: any) => {
        e['url'] = window.location.href;
        let highlights = new Map<number, number>();
        Object.keys(e['highlights']).forEach((key: string) => {
          highlights.set(parseInt(key), e['highlights'][key]);
        });
        e['highlights'] = highlights;
      });
      const actualLog = highlightingLog.entries.map(
        (e: HighlightingLogEntry) => {
          return { highlights: e.highlights, url: e.url };
        }
      );
      expect(actualLog).toEqual(expectedLog);
    }

    function parseDocument(path: string): Document {
      return new DOMParser().parseFromString(
        readFixture(path),
        'application/xml'
      );
    }
  });
});
