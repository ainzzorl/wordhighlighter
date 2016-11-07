///<reference path="dao.ts" />

console.log('In content script');

let dao = new DAO();
dao.getWords(function(words: Array<string>) {
    console.log('Received words: ' + words);
});
