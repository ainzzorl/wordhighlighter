///<reference path="../lib/dao.ts" />

console.log('In content script');

let dao = new DAO();
dao.getDictionary(function(dictionary: Array<DictionaryEntry>) {
    console.log('Received words: ' + dictionary);
    substitute(dictionary);
});

function substitute(dictionary: Array<DictionaryEntry>) {
    let html = document.body.innerHTML;

    dictionary.forEach(function(dictionaryEntry) {
      html = html.replace(dictionaryEntry.value, "<span class='highlighted-word'>" + dictionaryEntry.value + "</span>");
    });

    document.body.innerHTML = html;
}
