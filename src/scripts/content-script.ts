///<reference path="../lib/dao.ts" />
///<reference path="../lib/content.ts" />

let timeStart = performance.now();
console.log('Processing URL ' + document.URL);
// TODO: read dictionary and settings at once.
new DAO().getDictionary(function(dictionary: Array<DictionaryEntry>) {
    new DAO().getSettings(function(settings: Settings) {
        if (settings.enableHighlighting) {
            // TODO: explain
            let wnd: any = window;
            let stemmer: Stemmer = wnd.stemmer;

            let textNodeHandler = new TextNodeHandler(dictionary, stemmer);
            let content = new Content(textNodeHandler);
            content.injectMarkup(document);
        }
        let timeEnd = performance.now();
        let seconds = (timeEnd - timeStart) / 1000;
        console.log('Finished processing ' + document.URL + ' in ' + seconds.toFixed(2) + ' seconds');
    });
});
