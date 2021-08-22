///<reference path="../lib/content.ts" />
///<reference path="../lib/common/dao.ts" />
///<reference path="../lib/common/logger.ts" />
///<reference path="../lib/common/group.ts" />
///<reference path="../lib/common/blocklist.ts" />

// Content script: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Content_scripts

let timeStart = performance.now();
WHLogger.log('Processing URL ' + document.URL);
new DAO().getDictionary().then((dictionary: Array<DictionaryEntry>) => {
  new DAO().getSettings().then((settings: Settings) => {
    new DAO().getHighlightingLog().then((highlightingLog: HighlightingLog) => {
      new DAO().getGroups().then((groups: Array<Group>) => {
        // "stemmers" is not in Window class,
        // so we need to convert the object to "any" to read the property.
        let wnd: any = window;

        if (
          isBlocked(
            window.location.href,
            settings.blockedWebsites,
            settings.allowedWebsites
          )
        ) {
          WHLogger.log(`URL ${window.location.href} is blocked globally`);
          return;
        }
        groups = groups.filter((group: Group) => {
          return !isBlocked(
            window.location.href,
            group.blockedWebsites,
            group.allowedWebsites
          );
        });
        if (groups.length === 0) {
          WHLogger.log(`URL ${window.location.href} is blocked for all groups`);
          return;
        }

        let dao = new DAO();
        let highlightInjector = new HighlightInjectorImpl(
          new HighlightGenerator(groups, settings)
        );
        let matchFinder = new MatchFinderImpl(
          dictionary,
          new Map<string, Stemmer>(Object.entries(wnd.stemmers)),
          groups
        );

        let content = new Content(
          dao,
          settings,
          highlightInjector,
          matchFinder,
          highlightingLog
        );
        content.processDocument(document);
        let timeEnd = performance.now();
        let seconds = (timeEnd - timeStart) / 1000;
        WHLogger.log(
          'Finished processing ' +
            document.URL +
            ' in ' +
            seconds.toFixed(2) +
            ' seconds'
        );

        // Listen to new nodes added to the page.
        const onMutation = function (
          mutations: Array<MutationRecord>,
          _observer: any
        ) {
          for (const mutation of mutations) {
            mutation.addedNodes.forEach((addedNode: any) => {
              content.processNode(addedNode);
            });
          }
        };
        const observer = new MutationObserver(onMutation);
        observer.observe(document, { childList: true, subtree: true });
      });
    });
  });
});
