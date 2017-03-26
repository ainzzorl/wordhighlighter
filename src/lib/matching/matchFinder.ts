///<reference path="stemmer.ts" />
///<reference path="matchResultEntry.ts" />
///<reference path="../dictionaryEntry.ts" />

interface MatchFinder {
    findMatches(input: string): Array<MatchResultEntry>;
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
        if (stemmer) {
            this.calculateIndexes();
        }
    }

    // TODO: too complex, simplify.
    // Possibly by adding a special char at the end.
    findMatches(input: string): Array<MatchResultEntry> {
        let result: Array<MatchResultEntry> = [];
        let currentWord = '';
        let currentNoMatch = '';
        for (let i = 0; i < input.length; ++i) {
            if (this.isWordCharacter(input[i])) {
                currentWord += input[i];
            } else {
                if (currentWord.length > 0) {
                    let match = this.findMatchForWord(currentWord);
                    if (match) {
                        if (currentNoMatch.length > 0) {
                            result.push({
                                value: currentNoMatch,
                                matchOf: null
                            });
                        }
                        result.push({
                            value: currentWord,
                            matchOf: match
                        });
                        currentNoMatch = input[i];
                        currentWord = '';
                    } else {
                        currentNoMatch += currentWord + input[i];
                        currentWord = '';
                    }
                } else {
                    currentNoMatch += input[i];
                }
            }
        }
        if (currentWord.length > 0) {
            let match = this.findMatchForWord(currentWord);
            if (match) {
                if (currentNoMatch.length > 0) {
                    result.push({
                        value: currentNoMatch,
                        matchOf: null
                    });
                }
                result.push({
                    value: currentWord,
                    matchOf: match
                });
            } else {
                result.push({
                    value: currentNoMatch + currentWord,
                    matchOf: null
                });
            }
        } else {
            if (currentNoMatch.length > 0) {
                result.push({
                    value: currentNoMatch,
                    matchOf: null
                });
            }
        }
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
        return char[0] >= 'a' && char[0] <= 'z' || char[0] >= 'A' && char[0] <= 'Z';
    }

    private calculateIndexes(): void {
        this.dictionaryStemMap = {};
        this.strictMatchMap = {};
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

    private removeIgnoredPrefixes(input: string): string {
        let result = input;
        this.IGNORED_PREFIXES.forEach(function(prefix: string) {
            if (result.toLowerCase().lastIndexOf(prefix, 0) === 0) {
                result = result.substring(prefix.length);
            }
        });
        return result;
    }
}
