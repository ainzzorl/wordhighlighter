///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/dom/highlightInjector.ts" />
///<reference path="../../src/lib/dom/highlightGenerator.ts" />

describe('highlightInjector', () => {
  let highlightInjector: HighlightInjector;
  let highlightGenerator: HighlightGenerator;

  beforeEach(() => {
    highlightGenerator = new HighlightGenerator(
      [
        new Group(
          1,
          'group-name',
          'background-color',
          MatchingType.SMART,
          'smart-matching-language'
        ),
      ],
      Settings.DEFAULT
    );
    highlightGenerator.generate = (
      word: string,
      dictionaryEntry: DictionaryEntry
    ) => {
      return (
        '(' +
        word +
        '-' +
        (dictionaryEntry ? dictionaryEntry.value : 'null') +
        ')'
      );
    };
    highlightInjector = new HighlightInjectorImpl(highlightGenerator);
  });

  describe('inject', () => {
    let rootNode: HTMLElement;
    let textNode: Text;

    beforeEach(() => {
      rootNode = document.createElement('div');
      textNode = document.createTextNode('Internet for people, not profit');
      rootNode.appendChild(textNode);

      let matchResult = [
        { value: 'Internet for ', matchOf: null },
        {
          value: 'people',
          matchOf: new DictionaryEntry(1, 'People', '', new Date(), new Date()),
        },
        { value: ', not ', matchOf: null },
        {
          value: 'profit',
          matchOf: new DictionaryEntry(2, 'Profit', '', new Date(), new Date()),
        },
      ];

      highlightInjector.inject(textNode, matchResult);
    });

    it('injects markup', () => {
      expect(rootNode.innerHTML).toEqual(
        'Internet for (people-People), not (profit-Profit)'
      );
    });
  });
});
