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
        this.dao.getDictionary(function(dictionary: Array<DictionaryEntry>) {
            content.substitute(document, dictionary);
        });
    }

    substitute(node: Node, dictionary: Array<DictionaryEntry>): void {
        let child = node.firstChild;
        if (node.childNodes.length === 1 && node.firstChild.nodeType === Node.TEXT_NODE) {
            this.substituteText(<HTMLElement> node, dictionary);
            return;
        }
        while (child) {
            this.substitute(child, dictionary);
            child = <HTMLElement> child.nextSibling;
        }
    }

    substituteText(node: HTMLElement, dictionary: Array<DictionaryEntry>) {
        let originalHtml = node.innerHTML;
        let replacementHtml = originalHtml;
        dictionary.forEach(function(dictionaryEntry) {
            replacementHtml = replacementHtml.replace(dictionaryEntry.value, "<span class='highlighted-word'>" + dictionaryEntry.value + "</span>");
        });
        if (originalHtml !== replacementHtml) {
            node.innerHTML = replacementHtml;
        }
    }
}