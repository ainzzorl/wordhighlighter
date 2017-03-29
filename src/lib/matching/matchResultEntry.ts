///<reference path="../common/dictionaryEntry.ts" />

/**
 * A result of a matching request.
 * Means that "value" matches a dictionary entry in matchOf.
 */
interface MatchResultEntry {
    value: string;
    matchOf: DictionaryEntry;
}
