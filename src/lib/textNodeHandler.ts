///<reference path="dictionaryEntry.ts" />
///<reference path="matchResultEntry.ts" />

class TextNodeHandler {
    dictionary: Array<DictionaryEntry>;

    constructor(dictionary: Array<DictionaryEntry>) {
        this.dictionary = dictionary;
    }

    injectMarkup(node: Node): Array<HTMLElement> {
        let original = node.textContent;
        let replacementHtml = original;
        this.dictionary.forEach(function(dictionaryEntry) {
            replacementHtml = replacementHtml.replace(dictionaryEntry.value, "<span class='highlighted-word'>" + dictionaryEntry.value + "</span>");
        });
        if (original === replacementHtml) {
            return null;
        } else {
            let newNode = document.createElement('span');
            newNode.innerHTML = replacementHtml;
            return Array.prototype.slice.call(newNode.childNodes);
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
        for (let i = 0; i < this.dictionary.length; ++i) {
            if (word === this.dictionary[i].value) {
                return this.dictionary[i].value;
            }
        };
        return null;;
    }

    private isWordCharacter(char: string) {
        return char[0] >= 'a' && char[0] <= 'z' || char[0] >= 'A' && char[0] <= 'Z';
    }
}