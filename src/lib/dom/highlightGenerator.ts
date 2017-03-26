///<reference path="../dictionaryEntry.ts" />

class HighlightGenerator {
    /**
     * Given a word and a dictionary entry matching it,
     * generate a chunk of HTML highlighting this word.
     */
    generate(word: string, dictionaryEntry: DictionaryEntry) {
        return '<span class="highlighted-word">'
                + word
                + this.tooltipContent(dictionaryEntry)
                + '</span>';
    }

    private tooltipContent(entry: DictionaryEntry) {
        let wrappedDescription = entry.description ?
            '<div class="highlighted-word-description">' + entry.description + '</div>' : '';
        let wordClass = entry.description ? '' : 'highlighted-word-title-no-description';
        return '<div class="highlighted-word-tooltip-wrapper"><div class="highlighted-word-tooltip">'
                + '<p class="' + wordClass + '">' + entry.value + '</p>'
                + wrappedDescription
                + '</div></div>';
    }
}
