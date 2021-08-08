///<reference path="../common/dictionaryEntry.ts" />
///<reference path="../common/group.ts" />

/**
 * Class responsible for generating highlights for a word.
 */
class HighlightGenerator {
  private groups: Array<Group>;
  private settings: Settings;

  constructor(groups: Array<Group>, settings: Settings) {
    this.groups = groups;
    this.settings = settings;
  }

  /**
   * Generate a chunk of HTML highlighting the word.
   * @param word Word that needs to be highlighted.
   * @param dictionaryEntry Dictionary entry matching the word.
   */
  generate(word: string, dictionaryEntry: DictionaryEntry) {
    return `<span class="highlighted-word" style="background-color: #${this.getBackgroundColor(
      dictionaryEntry
    )};">${word}${this.tooltipContent(dictionaryEntry)}</span>`;
  }

  private tooltipContent(entry: DictionaryEntry) {
    if (!this.showTooltip(entry)) {
      return '';
    }
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

  private getBackgroundColor(entry: DictionaryEntry) {
    return this.groups.filter((group) => group.id === entry.groupId)[0]
      .backgroundColor;
  }

  private showTooltip(entry: DictionaryEntry) {
    return this.settings.showTooltip == ShowTooltip.ALWAYS || this.settings.showTooltip == ShowTooltip.WITH_DESCRIPTION && entry.description;
  }
}
