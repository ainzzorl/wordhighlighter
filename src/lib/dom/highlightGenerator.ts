///<reference path="../common/dictionaryEntry.ts" />

/**
 * Class responsible for generating highlights for a word.
 */
class HighlightGenerator {
  private settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
  }

  /**
   * Generate a chunk of HTML highlighting the word.
   * @param word Word that needs to be highlighted.
   * @param dictionaryEntry Dictionary entry matching the word.
   */
  generate(word: string, dictionaryEntry: DictionaryEntry) {
    return `<span class="highlighted-word" style="background-color: #${
      this.settings.backgroundColor
    };">${word}${this.tooltipContent(dictionaryEntry)}</span>`;
  }

  private tooltipContent(entry: DictionaryEntry) {
    let wrappedDescription = entry.description
      ? `<div class="highlighted-word-description">${entry.description}</div>`
      : '';
    let wordClass = entry.description
      ? ''
      : 'highlighted-word-title-no-description';
    return `<div class="highlighted-word-tooltip-wrapper">
                    <div class="highlighted-word-tooltip">
                        <p class="${wordClass}">${entry.value}</p>
                        ${wrappedDescription}
                    </div>
                </div>`;
  }
}
