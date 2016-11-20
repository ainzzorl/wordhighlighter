///<reference path="dictionaryEntry.ts" />

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
}