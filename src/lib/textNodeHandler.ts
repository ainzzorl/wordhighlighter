///<reference path="stemmer.ts" />
///<reference path="dictionaryEntry.ts" />
///<reference path="matchResultEntry.ts" />


class TextNodeHandler {
    dictionary: Array<DictionaryEntry>;
    stemmer: Stemmer;
    dictionaryStems: any;

    constructor(dictionary: Array<DictionaryEntry>, stemmer: Stemmer) {
        this.dictionary = dictionary;
        this.stemmer = stemmer;
        if (stemmer) {
            this.calculateDictionaryStems();
        }
    }

    injectMarkup(node: Node): Array<HTMLElement> {
        let matchResults = this.findMatches(node.textContent);
        let html = '';
        if (matchResults.length === 1 && !matchResults[0].matchOf) {
            return null;
        }
        for (let i = 0; i < matchResults.length; ++i) {
            if (matchResults[i].matchOf) {
                html += this.wrap(matchResults[i].value);
            } else {
                html += matchResults[i].value;
            }
        }
        let newNode = document.createElement('doesnotmatter');
        newNode.innerHTML = html;
        return Array.prototype.slice.call(newNode.childNodes);
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
                            })
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
                    })
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
                })
            }
        }
        return result;
    }

    findMatchForWord(word: string): string {
        let targetStem = this.stemmer.stem(word);
        let result = <DictionaryEntry> this.dictionaryStems[targetStem];
        return result ? result.value : null;
    }

    private isWordCharacter(char: string) {
        return char[0] >= 'a' && char[0] <= 'z' || char[0] >= 'A' && char[0] <= 'Z';
    }

    private wrap(word: string) {
        return "<span class='highlighted-word'>" + word + "</span>";
    }

    private calculateDictionaryStems(): void {
        this.dictionaryStems = {};
        for (let i = 0; i < this.dictionary.length; ++i) {
            let stem = this.stemmer.stem(this.dictionary[i].value);
            if (stem) {
                this.dictionaryStems[stem] = this.dictionary[i];
            }
        }
    }
}
