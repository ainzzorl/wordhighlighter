///<reference path="../lib/dao.ts" />
///<reference path="../lib/content.ts" />
let timeStart = performance.now();
console.log('Processing URL ' + document.URL);
new DAO().getDictionary(function(dictionary: Array<DictionaryEntry>) {
    let textNodeHandler = new TextNodeHandler(dictionary);
    let content = new Content(textNodeHandler);
    content.injectMarkup(document);
    let timeEnd = performance.now();
    let seconds = (timeEnd - timeStart) / 1000;
    console.log('Finished processing ' + document.URL + ' in ' + seconds.toFixed(2) + ' seconds');
});
