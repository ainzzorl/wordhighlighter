///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/matching/matchFinder.ts" />
///<reference path="../../src/lib/matching/matchResultEntry.ts" />
///<reference path="../../src/lib/common/dictionaryEntry.ts" />

describe('MatchFinder', () => {
  let matchFinder: MatchFinder;
  let stemmers: any;
  let dictionary: Array<DictionaryEntry>;
  let groups: Array<Group>;

  describe('findMatches', () => {
    let stemmer: FakeStemmer;

    describe('multiple words in the input', () => {
      beforeEach(() => {
        stemmer = new FakeStemmer();
        stemmers = new Map<string, Stemmer>([
          [Group.DEFAULT_MATCHING_LANGUAGE, stemmer],
        ]);

        dictionary = [];
        dictionary.push(
          new DictionaryEntry(1, 'people', '', new Date(), new Date())
        );
        dictionary.push(
          new DictionaryEntry(2, 'profit', '', new Date(), new Date())
        );
        // Chinese
        dictionary.push(
          new DictionaryEntry(3, '中文', '', new Date(), new Date(), true)
        );
        // Japanese
        dictionary.push(
          new DictionaryEntry(4, '日本語', '', new Date(), new Date(), true)
        );
        // Russian
        dictionary.push(
          new DictionaryEntry(5, 'русский', '', new Date(), new Date(), true)
        );
        // Spanish
        dictionary.push(
          new DictionaryEntry(6, 'español', '', new Date(), new Date(), true)
        );
        // French
        dictionary.push(
          new DictionaryEntry(7, 'français', '', new Date(), new Date(), true)
        );
        groups = [
          new Group(
            Group.DEFAULT_GROUP_ID,
            'Default',
            'color',
            Group.DEFAULT_MATCHING_TYPE,
            Group.DEFAULT_MATCHING_LANGUAGE
          ),
        ];

        matchFinder = new MatchFinderImpl(dictionary, stemmers, groups);
        matchFinder.buildIndexes();
      });

      it('finds 1 match in the middle', () => {
        let matchResult = matchFinder.findMatches('Internet for people, not');

        expect(matchResult.length).toEqual(3);
        expect(matchResult[0].value).toEqual('Internet for ');
        expect(matchResult[0].matchOf).toBeNull();
        expect(matchResult[1].value).toEqual('people');
        expect(matchResult[1].matchOf.value).toEqual('people');
        expect(matchResult[2].value).toEqual(', not');
        expect(matchResult[2].matchOf).toBeNull();
      });

      it('detects if there is no match', () => {
        let matchResult = matchFinder.findMatches('Text that does not match');

        expect(matchResult.length).toEqual(1);
        expect(matchResult[0].value).toEqual('Text that does not match');
        expect(matchResult[0].matchOf).toBeNull();
      });

      it("finds the match if it's the entire input", () => {
        let matchResult = matchFinder.findMatches('people');

        expect(matchResult.length).toEqual(1);
        expect(matchResult[0].value).toEqual('people');
        expect(matchResult[0].matchOf.value).toEqual('people');
      });

      it('find matches in the beginning', () => {
        let matchResult = matchFinder.findMatches('people and');

        expect(matchResult.length).toEqual(2);
        expect(matchResult[0].value).toEqual('people');
        expect(matchResult[0].matchOf.value).toEqual('people');
        expect(matchResult[1].value).toEqual(' and');
        expect(matchResult[1].matchOf).toBeNull();
      });

      it('finds matches in the end', () => {
        let matchResult = matchFinder.findMatches('not profit');

        expect(matchResult.length).toEqual(2);
        expect(matchResult[0].value).toEqual('not ');
        expect(matchResult[0].matchOf).toBeNull();
        expect(matchResult[1].value).toEqual('profit');
        expect(matchResult[1].matchOf.value).toEqual('profit');
      });

      describe('other alphabets', () => {
        it('matches chinese', () => {
          let matchResult = matchFinder.findMatches('中文');

          expect(matchResult.length).toEqual(1);
          expect(matchResult[0].value).toEqual('中文');
          expect(matchResult[0].matchOf.value).toEqual('中文');
        });

        it('matches japanese', () => {
          let matchResult = matchFinder.findMatches('日本語');

          expect(matchResult.length).toEqual(1);
          expect(matchResult[0].value).toEqual('日本語');
          expect(matchResult[0].matchOf.value).toEqual('日本語');
        });

        it('matches russian', () => {
          let matchResult = matchFinder.findMatches('русский');

          expect(matchResult.length).toEqual(1);
          expect(matchResult[0].value).toEqual('русский');
          expect(matchResult[0].matchOf.value).toEqual('русский');
        });

        it('matches spanish match', () => {
          let matchResult = matchFinder.findMatches('español');
          expect(matchResult.length).toEqual(1);
          expect(matchResult[0].value).toEqual('español');
          expect(matchResult[0].matchOf.value).toEqual('español');
        });
      });

      it('matches french', () => {
        let matchResult = matchFinder.findMatches('français');

        expect(matchResult.length).toEqual(1);
        expect(matchResult[0].value).toEqual('français');
        expect(matchResult[0].matchOf.value).toEqual('français');
      });
    });

    describe('one words in the input', () => {
      beforeEach(() => {
        dictionary = [];
        dictionary.push(
          new DictionaryEntry(1, 'advent', '', new Date(), new Date())
        );
        dictionary.push(
          new DictionaryEntry(2, 'something', '', new Date(), new Date())
        );
        dictionary.push(
          new DictionaryEntry(3, 'To hamper', '', new Date(), new Date())
        );
        dictionary.push(
          new DictionaryEntry(4, 'go to work', '', new Date(), new Date())
        );
        dictionary.push(
          new DictionaryEntry(5, 'Contention', '', new Date(), new Date(), true)
        );
        dictionary.push(
          new DictionaryEntry(5, 'read, to', '', new Date(), new Date())
        );
        stemmer = new FakeStemmer();
        stemmer.override('advent', 'advent');
        stemmer.override('advents', 'advent');
        stemmer.override('adventure', 'adventur');
        stemmer.overridePrefix('content', 'content');

        stemmers = new Map<string, Stemmer>([
          [Group.DEFAULT_MATCHING_LANGUAGE, stemmer],
        ]);
        groups = [
          new Group(
            Group.DEFAULT_GROUP_ID,
            'Default',
            'color',
            Group.DEFAULT_MATCHING_TYPE,
            Group.DEFAULT_MATCHING_LANGUAGE
          ),
        ];

        matchFinder = new MatchFinderImpl(dictionary, stemmers, groups);
        matchFinder.buildIndexes();
      });

      describe('stem matching', () => {
        it('finds exact match', () => {
          expect(findOneMatchValue('advent')).toEqual('advent');
        });

        it('finds stem match', () => {
          expect(findOneMatchValue('advents')).toEqual('advent');
        });

        it('detects no match', () => {
          expect(findOneMatchValue('adventure')).toBeNull();
        });

        it('ignores "to" at the beginning', () => {
          expect(findOneMatchValue('hamper')).toEqual('To hamper');
        });

        it('ignores ", to" at the end', () => {
          expect(findOneMatchValue('read')).toEqual('read, to');
        });

        it('does not ignore "to" elsewhere', () => {
          expect(findOneMatchValue('go')).toBeNull();
          expect(findOneMatchValue('go work')).toBeNull();
        });
      });

      describe('strict matching', () => {
        it('finds exact match', () => {
          expect(findOneMatchValue('contention')).toEqual('Contention');
        });

        it('ignores case', () => {
          expect(findOneMatchValue('cOnTeNtIoN')).toEqual('Contention');
        });

        it('does not find stem match', () => {
          expect(findOneMatchValue('content')).toBeNull();
        });
      });
    });

    describe('multi-word matches', () => {
      beforeEach(() => {
        stemmer = new FakeStemmer();
        stemmer.overridePrefix('one', 'one');
        stemmer.overridePrefix('two', 'two');
        stemmer.overridePrefix('three', 'three');
        stemmers = new Map<string, Stemmer>([
          [Group.DEFAULT_MATCHING_LANGUAGE, stemmer],
        ]);

        dictionary = [];
        dictionary.push(
          new DictionaryEntry(1, 'three', '', new Date(), new Date())
        );
        dictionary.push(
          new DictionaryEntry(2, 'one TWO', '', new Date(), new Date(), true)
        );
        dictionary.push(
          new DictionaryEntry(3, 'twos, threes', '', new Date(), new Date())
        );
        dictionary.push(
          new DictionaryEntry(4, 'OnE-tWo-ThReEs', '', new Date(), new Date())
        );
        groups = [
          new Group(
            Group.DEFAULT_GROUP_ID,
            'Default',
            'color',
            Group.DEFAULT_MATCHING_TYPE,
            Group.DEFAULT_MATCHING_LANGUAGE
          ),
        ];
        matchFinder = new MatchFinderImpl(dictionary, stemmers, groups);
        matchFinder.buildIndexes();
      });

      it('finds 1 two-word match', () => {
        let matchResult = matchFinder.findMatches('!one two four');

        expect(matchResult.length).toEqual(3);
        expect(matchResult[0].value).toEqual('!');
        expect(matchResult[0].matchOf).toBeNull();
        expect(matchResult[1].value).toEqual('one two');
        expect(matchResult[1].matchOf.value).toEqual('one TWO');
        expect(matchResult[2].value).toEqual(' four');
        expect(matchResult[2].matchOf).toBeNull();
      });

      it('finds non strict match', () => {
        let matchResult = matchFinder.findMatches(
          'hello oNeS tWoS, tHrEe goodbye...'
        );

        expect(matchResult.length).toEqual(3);
        expect(matchResult[0].value).toEqual('hello ');
        expect(matchResult[0].matchOf).toBeNull();
        expect(matchResult[1].value).toEqual('oNeS tWoS, tHrEe');
        expect(matchResult[1].matchOf.value).toEqual('OnE-tWo-ThReEs');
        expect(matchResult[2].value).toEqual(' goodbye...');
        expect(matchResult[2].matchOf).toBeNull();
      });

      it("doest not find strict match when there's none", () => {
        let matchResult = matchFinder.findMatches('ones twos');
        expect(matchResult.length).toEqual(1);
        expect(matchResult[0].value).toEqual('ones twos');
      });

      it('handles possible overlaps', () => {
        let matchResult = matchFinder.findMatches('one two three');

        expect(matchResult.length).toEqual(3);
        expect(matchResult[0].value).toEqual('one two');
        expect(matchResult[0].matchOf.value).toEqual('one TWO');
        expect(matchResult[1].value).toEqual(' ');
        expect(matchResult[1].matchOf).toBeNull();
        expect(matchResult[2].value).toEqual('three');
        expect(matchResult[2].matchOf.value).toEqual('three');
      });

      it('finds the longest match', () => {
        stemmers = new Map<string, Stemmer>([
          [Group.DEFAULT_MATCHING_LANGUAGE, new FakeStemmer()],
        ]);

        dictionary = [
          new DictionaryEntry(1, 'one', '', new Date(), new Date()),
          new DictionaryEntry(2, 'two', '', new Date(), new Date()),
          new DictionaryEntry(3, 'three', '', new Date(), new Date()),
          new DictionaryEntry(4, 'one two', '', new Date(), new Date()),
          new DictionaryEntry(5, 'one two three', '', new Date(), new Date()),
        ];
        groups = [
          new Group(
            Group.DEFAULT_GROUP_ID,
            'Default',
            'color',
            Group.DEFAULT_MATCHING_TYPE,
            Group.DEFAULT_MATCHING_LANGUAGE
          ),
        ];
        matchFinder = new MatchFinderImpl(dictionary, stemmers, groups);
        matchFinder.buildIndexes();

        let matchResult = matchFinder.findMatches('one two three four');

        expect(matchResult.length).toEqual(2);
        expect(matchResult[0].value).toEqual('one two three');
        expect(matchResult[0].matchOf.value).toEqual('one two three');
        expect(matchResult[1].value).toEqual(' four');
        expect(matchResult[1].matchOf).toBeNull();
      });
    });

    // TODO: one more group
    describe('group configs', () => {
      beforeEach(() => {
        dictionary = [
          new DictionaryEntry(
            1,
            'cherry',
            '',
            new Date(),
            new Date(),
            false,
            1
          ),
          new DictionaryEntry(2, 'apple', '', new Date(), new Date(), true, 1),

          new DictionaryEntry(3, 'gato', '', new Date(), new Date(), false, 2),
          new DictionaryEntry(4, 'perro', '', new Date(), new Date(), true, 3),
          new DictionaryEntry(5, 'vaca', '', new Date(), new Date(), true, 4),

          new DictionaryEntry(6, 'пень', '', new Date(), new Date(), false, 5),
          new DictionaryEntry(
            7,
            'колоды',
            '',
            new Date(),
            new Date(),
            false,
            5
          ),
        ];
        groups = [
          new Group(1, 'English', '', MatchingType.STRICT, 'English'),

          new Group(2, 'Spanish 1', '', MatchingType.SMART, 'es'),
          new Group(3, 'Spanish 2', '', MatchingType.SMART, 'es'),
          new Group(4, 'Spanish 3', '', MatchingType.STRICT, 'es'),

          new Group(5, 'Russian', '', MatchingType.SMART, 'ru'),
        ];

        let stemmerEn = new FakeStemmer();
        stemmerEn.override('cherries', 'cherry');
        stemmerEn.override('apples', 'apple');

        let stemmerEs = new FakeStemmer();
        stemmerEs.override('gatos', 'gato');
        stemmerEs.override('perros', 'perro');
        stemmerEs.override('vacas', 'vaca');

        let stemmerRu = new FakeStemmer();
        stemmerRu.override('колоды', 'колод');
        stemmerRu.override('колода', 'колод');

        stemmers = new Map<string, Stemmer>([
          ['en', stemmerEn],
          ['es', stemmerEs],
          ['ru', stemmerRu],
        ]);
        matchFinder = new MatchFinderImpl(dictionary, stemmers, groups);
        matchFinder.buildIndexes();
      });

      describe('smart matching disabled for group', () => {
        it('finds exact match', () => {
          expect(findOneMatchValue('cherry')).toEqual('cherry');
          expect(findOneMatchValue('apple')).toEqual('apple');
          expect(findOneMatchValue('vaca')).toEqual('vaca');
        });

        it('does not do smart match', () => {
          expect(findOneMatchValue('cherries')).toBeNull();
          expect(findOneMatchValue('apples')).toBeNull();
          expect(findOneMatchValue('vacas')).toBeNull();
        });
      });

      describe('smart matching enabled for group', () => {
        it('finds exact match', () => {
          expect(findOneMatchValue('gato')).toEqual('gato');
          expect(findOneMatchValue('perro')).toEqual('perro');
          expect(findOneMatchValue('пень')).toEqual('пень');
          expect(findOneMatchValue('колоды')).toEqual('колоды');
        });

        it('finds stem match if not restricted to strict match', () => {
          expect(findOneMatchValue('gatos')).toEqual('gato');
          expect(findOneMatchValue('колода')).toEqual('колоды');
        });

        it('does not find stem match if restricted to strict match', () => {
          expect(findOneMatchValue('perros')).toBeNull();
        });
      });
    });

    describe('language not supporting smart matching', () => {
      beforeEach(() => {
        dictionary = [
          new DictionaryEntry(1, '日本語', '', new Date(), new Date()),
        ];
        stemmers = new Map<string, Stemmer>();
        groups = [
          new Group(
            Group.DEFAULT_GROUP_ID,
            'Default',
            'color',
            MatchingType.SMART,
            'jp'
          ),
        ];

        matchFinder = new MatchFinderImpl(dictionary, stemmers, groups);
        matchFinder.buildIndexes();
      });

      it('finds matches', () => {
        expect(findOneMatchValue('日本語')).toEqual('日本語');
      });
    });

    describe('some groups are not provided', () => {
      beforeEach(() => {
        dictionary = [
          new DictionaryEntry(1, 'hello', '', new Date(), new Date(), true, 1),
          // this group is not passed
          new DictionaryEntry(2, 'hola', '', new Date(), new Date(), true, 2),
        ];
        stemmers = new Map<string, Stemmer>();
        groups = [new Group(1, 'Default', 'color', MatchingType.SMART, 'en')];

        matchFinder = new MatchFinderImpl(dictionary, stemmers, groups);
        matchFinder.buildIndexes();
      });

      it('finds matches only from present groups', () => {
        let matchResult = matchFinder.findMatches('hello hola');
        expect(matchResult.length).toEqual(2);
        expect(matchResult[0].value).toEqual('hello');
        expect(matchResult[0].matchOf.value).toEqual('hello');
        expect(matchResult[1].value).toEqual(' hola');
        expect(matchResult[1].matchOf).toBeNull();
      });
    });
  });

  // Helper function to simplify test cases
  // when it's expected to find exactly one match.
  function findOneMatchValue(input: string) {
    let result = matchFinder.findMatches(input);
    expect(result.length).toEqual(1);
    return result[0].matchOf ? result[0].matchOf.value : null;
  }
});

class FakeStemmer implements Stemmer {
  overrides: Map<string, string> = new Map<string, string>();
  prefixOverrides: Map<string, string> = new Map<string, string>();

  stem(input: string): string {
    if (this.overrides.has(input.toLowerCase())) {
      return this.overrides.get(input.toLowerCase());
    }
    let result = null;
    this.prefixOverrides.forEach((value: String, prefix: string) => {
      if (input.toLowerCase().startsWith(prefix)) {
        result = this.prefixOverrides.get(prefix);
      }
    });
    return result !== null ? result : input;
  }

  override(from: string, to: string) {
    this.overrides.set(from.toLowerCase(), to);
  }

  overridePrefix(prefix: string, to: string) {
    this.prefixOverrides.set(prefix.toLowerCase(), to);
    console.log(this.prefixOverrides.size);
  }
}
