///<reference path="stemmer.ts" />
///<reference path="matchResultEntry.ts" />
///<reference path="token.ts" />
///<reference path="../common/dictionaryEntry.ts" />

/**
 * Matching logic.
 */
interface MatchFinder {
    /**
     * Detect matches in a string.
     * @param input Text string.
     */
    findMatches(input: string): Array<MatchResultEntry>;

    /**
     * Build indexes.
     */
    buildIndexes(): void;
}

class MatchFinderImpl implements MatchFinder {
    dictionary: Array<DictionaryEntry>;
    stemmer: Stemmer;
    dictionaryStemMap: any;
    strictMatchMap: any;
    contentWordStems: any; // TODO: cleanup to release memory

    private IGNORED_PREFIXES = ['a ', 'an ', 'to '];

    constructor(dictionary: Array<DictionaryEntry>, stemmer: Stemmer) {
        this.dictionary = dictionary;
        this.stemmer = stemmer;
        this.contentWordStems = {};
    }

    // Detect words matching the dictionary in the input.
    findMatches(input: string): Array<MatchResultEntry> {
        let result: Array<MatchResultEntry> = [];
        let currentNoMatch = '';
        this.tokenize(input).forEach((token: Token) => {
            if (!token.isWord) {
                currentNoMatch += token.value;
                return;
            }
            let match = this.findMatchForWord(token.value);
            if (!match) {
                currentNoMatch += token.value;
                return;
            }
            this.pushMatchIfNotEmpty(result, currentNoMatch, null);
            this.pushMatchIfNotEmpty(result, token.value, match);
            currentNoMatch = '';
        });
        this.pushMatchIfNotEmpty(result, currentNoMatch, null);
        return result;
    }

    // Build indexes. Must be called before matching.
    // Not automatically calling from the constructor to prevent
    // unnecessary calculations when highlighting is disabled.
    buildIndexes(): void {
        this.dictionaryStemMap = {};
        this.strictMatchMap = {};
        if (!this.stemmer) {
            return;
        }
        for (let i = 0; i < this.dictionary.length; ++i) {
            let entry: DictionaryEntry = this.dictionary[i];
            if (entry.strictMatch) {
                this.strictMatchMap[entry.value.toLowerCase()] = entry;
            } else {
                let stem = this.stemmer.stem(this.removeIgnoredPrefixes(entry.value));
                if (stem) {
                    this.dictionaryStemMap[stem] = entry;
                }
            }
        }
    }

    private tokenize(input: String): Array<Token> {
        let result: Array<Token> = [];
        let currentWord = '';
        let currentNonWord = '';
        for (let i = 0; i < input.length; ++i) {
            if (this.isWordCharacter(input[i])) {
                this.pushTokenIfNotEmpty(result, currentNonWord, false);
                currentNonWord = '';
                currentWord += input[i];
            } else {
                this.pushTokenIfNotEmpty(result, currentWord, true);
                currentWord = '';
                currentNonWord += input[i];
            }
        }
        this.pushTokenIfNotEmpty(result, currentNonWord, false);
        this.pushTokenIfNotEmpty(result, currentWord, true);
        return result;
    }

    private findMatchForWord(word: string): DictionaryEntry {
        let strictMatch = <DictionaryEntry> this.strictMatchMap[word.toLowerCase()];
        if (strictMatch && strictMatch.value) {
            return strictMatch;
        }

        let cachedStem = this.contentWordStems[word];
        let targetStem: string;
        if (cachedStem) {
            targetStem = cachedStem;
        } else {
            targetStem = this.stemmer.stem(word);
            this.contentWordStems[word] = targetStem;
        }
        let result = <DictionaryEntry> this.dictionaryStemMap[targetStem];
        return (result && result.value) ? result : null;
    }

    private isWordCharacter(char: string) {
        return char[0] >= 'a' && char[0] <= 'z'
                || char[0] >= 'A' && char[0] <= 'Z'
                || char[0] >= '0' && char[0] <= '9';
    }

    private removeIgnoredPrefixes(input: string): string {
        let result = input;
        this.IGNORED_PREFIXES.forEach(function(prefix: string) {
            if (result.toLowerCase().lastIndexOf(prefix, 0) === 0) {
                result = result.substring(prefix.length);
            }
        });
        return result;
    }

    private pushMatchIfNotEmpty(result: Array<MatchResultEntry>, value: string, matchOf: DictionaryEntry) {
        if (value.length > 0) {
            result.push({
                value: value,
                matchOf: matchOf
            });
        }
    }

    private pushTokenIfNotEmpty(result: Array<Token>, value: string, isWord: boolean) {
        if (value.length > 0) {
            result.push({
                value: value,
                isWord: isWord
            });
        }
    }
}
