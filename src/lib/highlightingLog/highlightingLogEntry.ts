/**
 * A persistent entry in the highlighting log.
 * Represents a single page load with highlights.
 */
class HighlightingLogEntry {
  readonly url: string;
  readonly date: Date;
  // dictionaryEntryId -> count.
  readonly highlights: { [key: number]: number };

  constructor(
    url: string,
    date: Date = new Date(),
    highlights: { [key: number]: number } = {}
  ) {
    this.url = url;
    this.date = date;
    this.highlights = highlights;
  }
}
