///<reference path="dao.ts" />

console.log('In content script');

let dao = new DAO();
dao.getWords(function(words: Array<string>) {
    console.log('Received words: ' + words);
    substitute(words);
});

function substitute(words: Array<string>) {
    let html = document.body.innerHTML;

    words.forEach(function(word) {
      html = html.replace(word, "<span class='highlighted-word'>" + word + "</span>");
    });

    document.body.innerHTML = html;
}
