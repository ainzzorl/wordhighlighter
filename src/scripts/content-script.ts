///<reference path="../lib/dao.ts" />
///<reference path="../lib/content.ts" />
///<reference path="../lib/logger.ts" />

let timeStart = performance.now();
WHLogger.log('Processing URL ' + document.URL);
// TODO: read dictionary and settings at once.
new DAO().getDictionary(function(dictionary: Array<DictionaryEntry>) {
    new DAO().getSettings(function(settings: Settings) {
        // TODO: explain
        let wnd: any = window;
        let stemmer: Stemmer = wnd.stemmer;

        // TODO: should not initialize stems if markup injection is disabled
        let textNodeHandler = new TextNodeHandler(dictionary, stemmer);
        let content = new Content(textNodeHandler, settings);
        content.processDocument(document);
        let timeEnd = performance.now();
        let seconds = (timeEnd - timeStart) / 1000;
        WHLogger.log('Finished processing ' + document.URL + ' in ' + seconds.toFixed(2) + ' seconds');
    });
});
