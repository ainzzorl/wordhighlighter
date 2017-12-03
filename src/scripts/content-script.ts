///<reference path="../lib/content.ts" />
///<reference path="../lib/common/dao.ts" />
///<reference path="../lib/common/logger.ts" />

// Content script: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Content_scripts

let timeStart = performance.now();
WHLogger.log('Processing URL ' + document.URL);
// TODO: read dictionary and settings at once.
new DAO().getDictionary(function(dictionary: Array<DictionaryEntry>) {
    new DAO().getSettings(function(settings: Settings) {
        new DAO().getHighlightingLog(function(highlightingLog: HighlightingLog) {
                // TODO: explain
            let wnd: any = window;
            let stemmer: Stemmer = wnd.stemmer;

            let dao = new DAO();
            let highlightInjector = new HighlightInjectorImpl(new HighlightGenerator());
            // TODO: should not initialize stems if markup injection is disabled
            let matchFinder = new MatchFinderImpl(dictionary, stemmer);

            let content = new Content(dao, settings, highlightInjector, matchFinder, highlightingLog);
            content.processDocument(document);
            let timeEnd = performance.now();
            let seconds = (timeEnd - timeStart) / 1000;
            WHLogger.log('Finished processing ' + document.URL + ' in ' + seconds.toFixed(2) + ' seconds');
        });
    });
});
