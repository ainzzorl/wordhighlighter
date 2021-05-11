///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/common/dictionaryEntry.ts" />
///<reference path="../../src/lib/dom/highlightGenerator.ts" />

describe('highlightGenerator', () => {
  let generator: HighlightGenerator;

  beforeEach(() => {
    generator = new HighlightGenerator();
    // Ignore all whitespace characters when comparing strings.
    // We use string interpolation a lot,
    // and because of it there are a lot of extra spaces and line breaks in the generated HTML.
    // It is safe to ignore them as they should make no difference.
    jasmine.addCustomEqualityTester(equalityIgnoreWhitespaces);
  });

  describe('generate', () => {
    describe('has description', () => {
      let result;

      beforeEach(() => {
        result = generator.generate(
          'source',
          new DictionaryEntry(1, 'word', 'description')
        );
      });

      it('wraps the entry', () => {
        expect(result).toEqual(
          `<span class="highlighted-word">
                        source
                        <div class="highlighted-word-tooltip-wrapper">
                            <div class="highlighted-word-tooltip">
                                <p class="">word</p>
                                <div class="highlighted-word-description">description</div>
                            </div>
                        </div>
                    </span>`
        );
      });
    });

    describe('no description', () => {
      let result;

      beforeEach(() => {
        result = generator.generate(
          'source',
          new DictionaryEntry(1, 'word', '')
        );
      });

      it('wraps the entry', () => {
        expect(result).toEqual(
          `<span class="highlighted-word">
                        source
                        <div class="highlighted-word-tooltip-wrapper">
                            <div class="highlighted-word-tooltip">
                                <p class="highlighted-word-title-no-description">word</p>
                            </div>
                        </div>
                    </span>`
        );
      });
    });
  });
});
