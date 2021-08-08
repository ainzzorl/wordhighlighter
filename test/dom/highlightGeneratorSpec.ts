///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/common/dictionaryEntry.ts" />
///<reference path="../../src/lib/common/settings.ts" />
///<reference path="../../src/lib/dom/highlightGenerator.ts" />

describe('highlightGenerator', () => {
  let generator: HighlightGenerator;
  let settings: Settings = new Settings();

  const ENTRY_WITH_DESCRIPTION = new DictionaryEntry(
    1,
    'word',
    'description',
    new Date(),
    new Date(),
    false,
    123
  );

  const ENTRY_WITHOUT_DESCRIPTION = new DictionaryEntry(
    1,
    'word',
    '',
    new Date(),
    new Date(),
    false,
    123
  );

  const EXPECTED_WITH_DESCRIPTION_WITH_TOOLTIP = `<span class="highlighted-word" style="background-color: #background-color;">
      source
      <div class="highlighted-word-tooltip-wrapper">
          <div class="highlighted-word-tooltip">
              <p class="">word</p>
              <div class="highlighted-word-description">description</div>
          </div>
      </div>
    </span>`;

  const EXPECTED_WITH_DESCRIPTION_WITHOUT_TOOLTIP = `<span class="highlighted-word" style="background-color: #background-color;">source</span>`;

  const EXPECTED_WITHOUT_DESCRIPTION_WITH_TOOLTIP = `<span class="highlighted-word" style="background-color: #background-color;">
    source
    <div class="highlighted-word-tooltip-wrapper">
        <div class="highlighted-word-tooltip">
            <p class="highlighted-word-title-no-description">word</p>
        </div>
    </div>
    </span>`;

  const EXPECTED_WITHOUT_DESCRIPTION_WITHOUT_TOOLTIP = `<span class="highlighted-word" style="background-color: #background-color;">source</span>`;

  beforeEach(() => {
    generator = new HighlightGenerator(
      [
        new Group(
          123,
          'group-name',
          'background-color',
          true,
          'smart-matching-language'
        ),
      ],
      settings
    );
    // Ignore all whitespace characters when comparing strings.
    // We use string interpolation a lot,
    // and because of it there are a lot of extra spaces and line breaks in the generated HTML.
    // It is safe to ignore them as they should make no difference.
    jasmine.addCustomEqualityTester(equalityIgnoreWhitespaces);
  });

  describe('generate', () => {
    describe('has description', () => {
      it('wraps the entry with tooltip if showTooltip=ALWAYS', () => {
        settings.showTooltip = ShowTooltip.ALWAYS;
        expect(generator.generate('source', ENTRY_WITH_DESCRIPTION)).toEqual(
          EXPECTED_WITH_DESCRIPTION_WITH_TOOLTIP
        );
      });

      it('wraps the entry with tooltip if showTooltip=WITH_DESCRIPTION', () => {
        settings.showTooltip = ShowTooltip.WITH_DESCRIPTION;
        expect(generator.generate('source', ENTRY_WITH_DESCRIPTION)).toEqual(
          EXPECTED_WITH_DESCRIPTION_WITH_TOOLTIP
        );
      });

      it('wraps the entry without tooltip if showTooltip=NEVER', () => {
        settings.showTooltip = ShowTooltip.NEVER;
        expect(generator.generate('source', ENTRY_WITH_DESCRIPTION)).toEqual(
          EXPECTED_WITH_DESCRIPTION_WITHOUT_TOOLTIP
        );
      });
    });

    describe('no description', () => {
      it('wraps the entry with tooltip if showTooltip=ALWAYS', () => {
        settings.showTooltip = ShowTooltip.ALWAYS;
        expect(generator.generate('source', ENTRY_WITHOUT_DESCRIPTION)).toEqual(
          EXPECTED_WITHOUT_DESCRIPTION_WITH_TOOLTIP
        );
      });

      it('wraps the entry without tooltip if showTooltip=WITH_DESCRIPTION', () => {
        settings.showTooltip = ShowTooltip.WITH_DESCRIPTION;
        expect(generator.generate('source', ENTRY_WITHOUT_DESCRIPTION)).toEqual(
          EXPECTED_WITHOUT_DESCRIPTION_WITHOUT_TOOLTIP
        );
      });

      it('wraps the entry without tooltip if showTooltip=ALWAYS', () => {
        settings.showTooltip = ShowTooltip.NEVER;
        expect(generator.generate('source', ENTRY_WITHOUT_DESCRIPTION)).toEqual(
          EXPECTED_WITHOUT_DESCRIPTION_WITHOUT_TOOLTIP
        );
      });
    });
  });
});
