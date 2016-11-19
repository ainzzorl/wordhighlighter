///<reference path="dao.ts" />
///<reference path="dictionaryEntry.ts" />

class Content {
    dao: DAO;
    document: Document;

    constructor(dao: DAO, document: Document) {
        this.dao = dao;
        this.document = document;
    }

    start(): void {
        let content = this;
        let timeStart = performance.now();
        console.log('Processing URL ' + document.URL);
        this.dao.getDictionary(function(dictionary: Array<DictionaryEntry>) {
            content.substitute(document, dictionary);
            let timeEnd = performance.now();
            let seconds = (timeEnd - timeStart) / 1000;
            console.log('Finished processing ' + document.URL + ' in ' + seconds.toFixed(2) + ' seconds');
        });
    }

    substitute(node: Node, dictionary: Array<DictionaryEntry>): void {
        let child = node.firstChild;
        while (child) {
            if (child.nodeType === Node.TEXT_NODE) {
                let replacementList = this.substituteInTextNode(<HTMLElement> child, dictionary);
                if (replacementList) {
                    let replacement = Array.prototype.slice.call(replacementList);

                    for (var i = 0; i < replacement.length; ++i) {
                        node.insertBefore(replacement[i], child);
                    }
                    let next = child.nextSibling;
                    node.removeChild(child);
                    child = next;
                    continue;
                } else {
                }
            } else {
                this.substitute(child, dictionary);
            }
            child = <HTMLElement> child.nextSibling;
        }
    }

    substituteInTextNode(node: HTMLElement, dictionary: Array<DictionaryEntry>): NodeList {
        let originalHtml = node.textContent;
        let replacementHtml = originalHtml;
        dictionary.forEach(function(dictionaryEntry) {
            replacementHtml = replacementHtml.replace(dictionaryEntry.value, "<span class='highlighted-word'>" + dictionaryEntry.value + "</span>");
        });
        if (originalHtml === replacementHtml) {
            return null;
        } else {
            let newNode = document.createElement('span');
            newNode.innerHTML = replacementHtml;
            return newNode.childNodes;
        }
    }
}