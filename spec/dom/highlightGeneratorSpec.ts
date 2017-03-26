///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/dictionaryEntry.ts" />
///<reference path="../../src/lib/dom/highlightGenerator.ts" />

describe('highlightGenerator', function() {
    let generator: HighlightGenerator;

    beforeEach(function() {
        generator = new HighlightGenerator();
    });

    describe('generate', function() {
        describe('has description', function() {
            let result;

            beforeEach(function() {
                result = generator.generate('source', new DictionaryEntry(1, 'word', 'description', null, null));
            });

            it('wraps the entry', function() {
                expect(result).toEqual(
                    '<span class="highlighted-word">'
                    + 'source'
                    + '<div class="highlighted-word-tooltip-wrapper">'
                    + '<div class="highlighted-word-tooltip">'
                    + '<p class="">word</p>'
                    + '<div class="highlighted-word-description">description</div>'
                    + '</div>'
                    + '</div>'
                    + '</span>');
            });
        });

        describe('no description', function() {
            let result;

            beforeEach(function() {
                result = generator.generate('source', new DictionaryEntry(1, 'word', '', null, null));
            });

            it('wraps the entry', function() {
                expect(result).toEqual(
                    '<span class="highlighted-word">'
                    + 'source'
                    + '<div class="highlighted-word-tooltip-wrapper">'
                    + '<div class="highlighted-word-tooltip">'
                    + '<p class="highlighted-word-title-no-description">word</p>'
                    + '</div>'
                    + '</div>'
                    + '</span>');
            });
        });
    });
});
