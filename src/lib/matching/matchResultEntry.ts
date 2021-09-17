///<reference path="../common/dictionaryEntry.ts" />

/**
 * A matching result entry.
 * If matchOf is set, then value matches matchOf.
 * If matchOf is not set, then value did not match anything in the dictionary.
 */
interface MatchResultEntry {
  value: string;
  matchOf: DictionaryEntry;
}
