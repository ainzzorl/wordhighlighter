///<reference path="dao.ts" />

class MainDialog {
    dao: DAO;
    document: Document;

    constructor(dao: DAO, document: Document) {
        this.dao = dao;
        this.document = document;
    }

    load(): void {
        this.dao.getWords(function(words: Array<string>) {
            let listElement = document.querySelector('ul');
            while (listElement.firstChild) {
                listElement.removeChild(listElement.firstChild);
            }

            for (let i=0; i < words.length; i++) {
                const listItem = document.createElement('li');
                listItem.textContent = words[i];
                listElement.appendChild(listItem);
            }
        });
    }
}
