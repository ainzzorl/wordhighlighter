///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/matching/matchFinder.ts" />
///<reference path="../../src/lib/matching/matchResultEntry.ts" />
///<reference path="../../src/lib/common/dictionaryEntry.ts" />

// TODO: consider using real stemmer
describe('MatchFinder', () => {
  let matchFinder: MatchFinder;
  let stemmer: Stemmer;
  let stemmers: any;
  let dictionary: Array<DictionaryEntry>;
  let groups: Array<Group>;
  let matchResult: Array<MatchResultEntry>;

  describe('findMatches', () => {
    describe('multiple words in the input', () => {
      beforeEach(() => {
        stemmer = {
          stem: function (word) {
            return word;
          },
        };
        stemmers = new Map<string, Stemmer>([
          [Group.DEFAULT_SMART_MATCHING_LANGUAGE, stemmer],
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
            Group.DEFAULT_SMART_MATCHING_LANGUAGE
          ),
        ];

        matchFinder = new MatchFinderImpl(dictionary, stemmers, groups);
        matchFinder.buildIndexes();
      });

      describe('1 match in the middle', () => {
        beforeEach(() => {
          matchResult = matchFinder.findMatches('Internet for people, not');
        });

        it('finds the match', () => {
          expect(matchResult.length).toEqual(3);
          expect(matchResult[0].value).toEqual('Internet for ');
          expect(matchResult[0].matchOf).toBeNull();
          expect(matchResult[1].value).toEqual('people');
          expect(matchResult[1].matchOf.value).toEqual('people');
          expect(matchResult[2].value).toEqual(', not');
          expect(matchResult[2].matchOf).toBeNull();
        });
      });

      describe('no match', () => {
        beforeEach(() => {
          matchResult = matchFinder.findMatches('Text that does not match');
        });

        it('detects that there is no match', () => {
          expect(matchResult.length).toEqual(1);
          expect(matchResult[0].value).toEqual('Text that does not match');
          expect(matchResult[0].matchOf).toBeNull();
        });
      });

      describe('all string is a match', () => {
        beforeEach(() => {
          matchResult = matchFinder.findMatches('people');
        });

        it('finds the match', () => {
          expect(matchResult.length).toEqual(1);
          expect(matchResult[0].value).toEqual('people');
          expect(matchResult[0].matchOf.value).toEqual('people');
        });
      });

      describe('match in the beginning', () => {
        beforeEach(() => {
          matchResult = matchFinder.findMatches('people and');
        });

        it('finds the match', () => {
          expect(matchResult.length).toEqual(2);
          expect(matchResult[0].value).toEqual('people');
          expect(matchResult[0].matchOf.value).toEqual('people');
          expect(matchResult[1].value).toEqual(' and');
          expect(matchResult[1].matchOf).toBeNull();
        });
      });

      describe('match in the end', () => {
        beforeEach(() => {
          matchResult = matchFinder.findMatches('not profit');
        });

        it('finds the match', () => {
          expect(matchResult.length).toEqual(2);
          expect(matchResult[0].value).toEqual('not ');
          expect(matchResult[0].matchOf).toBeNull();
          expect(matchResult[1].value).toEqual('profit');
          expect(matchResult[1].matchOf.value).toEqual('profit');
        });
      });

      describe('other alphabets', () => {
        describe('chinese', () => {
          beforeEach(() => {
            matchResult = matchFinder.findMatches('中文');
          });

          it('finds the match', () => {
            expect(matchResult.length).toEqual(1);
            expect(matchResult[0].value).toEqual('中文');
            expect(matchResult[0].matchOf.value).toEqual('中文');
          });
        });

        describe('japanese', () => {
          beforeEach(() => {
            matchResult = matchFinder.findMatches('日本語');
          });

          it('finds the match', () => {
            expect(matchResult.length).toEqual(1);
            expect(matchResult[0].value).toEqual('日本語');
            expect(matchResult[0].matchOf.value).toEqual('日本語');
          });
        });

        describe('russian', () => {
          beforeEach(() => {
            matchResult = matchFinder.findMatches('русский');
          });

          it('finds the match', () => {
            expect(matchResult.length).toEqual(1);
            expect(matchResult[0].value).toEqual('русский');
            expect(matchResult[0].matchOf.value).toEqual('русский');
          });
        });

        describe('spanish', () => {
          beforeEach(() => {
            matchResult = matchFinder.findMatches('español');
          });

          it('finds the match', () => {
            expect(matchResult.length).toEqual(1);
            expect(matchResult[0].value).toEqual('español');
            expect(matchResult[0].matchOf.value).toEqual('español');
          });
        });

        describe('français', () => {
          beforeEach(() => {
            matchResult = matchFinder.findMatches('français');
          });

          it('finds the match', () => {
            expect(matchResult.length).toEqual(1);
            expect(matchResult[0].value).toEqual('français');
            expect(matchResult[0].matchOf.value).toEqual('français');
          });
        });
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
        stemmer = {
          stem: function (word) {
            switch (word) {
              case 'advent':
                return 'advent';
              case 'advents':
                return 'advent';
              case 'adventure':
                return 'adventur';
            }
            if (word.toLowerCase().indexOf('content') === 0) {
              return 'content';
            }
            return word;
          },
        };
        stemmers = new Map<string, Stemmer>([
          [Group.DEFAULT_SMART_MATCHING_LANGUAGE, stemmer],
        ]);
        groups = [
          new Group(
            Group.DEFAULT_GROUP_ID,
            'Default',
            'color',
            Group.DEFAULT_MATCHING_TYPE,
            Group.DEFAULT_SMART_MATCHING_LANGUAGE
          ),
        ];

        matchFinder = new MatchFinderImpl(dictionary, stemmers, groups);
        matchFinder.buildIndexes();
      });

      function findWordMatch(input: string) {
        let result = matchFinder.findMatches(input);
        expect(result.length).toEqual(1);
        return result[0].matchOf ? result[0].matchOf.value : null;
      }

      describe('stem matching', () => {
        it('finds exact match', () => {
          expect(findWordMatch('advent')).toEqual('advent');
        });

        it('finds stem match', () => {
          expect(findWordMatch('advents')).toEqual('advent');
        });

        it('detects no match', () => {
          expect(findWordMatch('adventure')).toBeNull();
        });

        it('ignores "to" at the beginning', () => {
          expect(findWordMatch('hamper')).toEqual('To hamper');
        });

        it('ignores ", to" at the end', () => {
          expect(findWordMatch('read')).toEqual('read, to');
        });

        it('does not ignore "to" elsewhere', () => {
          expect(findWordMatch('go')).toBeNull();
          expect(findWordMatch('go work')).toBeNull();
        });
      });

      describe('strict matching', () => {
        it('finds exact match', () => {
          expect(findWordMatch('contention')).toEqual('Contention');
        });

        it('ignores case', () => {
          expect(findWordMatch('cOnTeNtIoN')).toEqual('Contention');
        });

        it('does not find stem match', () => {
          expect(findWordMatch('content')).toBeNull();
        });
      });
    });

    describe('multi-word matches', () => {
      beforeEach(() => {
        stemmer = {
          stem: function (word) {
            if (word.toLowerCase().indexOf('one') === 0) {
              return 'one';
            }
            if (word.toLowerCase().indexOf('two') === 0) {
              return 'two';
            }
            if (word.toLowerCase().indexOf('three') === 0) {
              return 'three';
            }
            return word;
          },
        };
        stemmers = new Map<string, Stemmer>([
          [Group.DEFAULT_SMART_MATCHING_LANGUAGE, stemmer],
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
            Group.DEFAULT_SMART_MATCHING_LANGUAGE
          ),
        ];
        matchFinder = new MatchFinderImpl(dictionary, stemmers, groups);
        matchFinder.buildIndexes();
      });

      describe('1 two-word match', () => {
        beforeEach(() => {
          matchResult = matchFinder.findMatches('!one two four');
        });

        it('finds the match', () => {
          expect(matchResult.length).toEqual(3);
          expect(matchResult[0].value).toEqual('!');
          expect(matchResult[0].matchOf).toBeNull();
          expect(matchResult[1].value).toEqual('one two');
          expect(matchResult[1].matchOf.value).toEqual('one TWO');
          expect(matchResult[2].value).toEqual(' four');
          expect(matchResult[2].matchOf).toBeNull();
        });
      });

      describe('non strict match', () => {
        beforeEach(() => {
          matchResult = matchFinder.findMatches(
            'hello oNeS tWoS, tHrEe goodbye...'
          );
        });

        it('finds the match', () => {
          expect(matchResult.length).toEqual(3);
          expect(matchResult[0].value).toEqual('hello ');
          expect(matchResult[0].matchOf).toBeNull();
          expect(matchResult[1].value).toEqual('oNeS tWoS, tHrEe');
          expect(matchResult[1].matchOf.value).toEqual('OnE-tWo-ThReEs');
          expect(matchResult[2].value).toEqual(' goodbye...');
          expect(matchResult[2].matchOf).toBeNull();
        });
      });

      describe('no strict match', () => {
        beforeEach(() => {
          matchResult = matchFinder.findMatches('ones twos');
        });

        it('does not finds the match', () => {
          expect(matchResult.length).toEqual(1);
          expect(matchResult[0].value).toEqual('ones twos');
        });
      });

      describe('possible overlaps', () => {
        beforeEach(() => {
          matchResult = matchFinder.findMatches('one two three');
        });

        it('finds two matches', () => {
          expect(matchResult.length).toEqual(3);
          expect(matchResult[0].value).toEqual('one two');
          expect(matchResult[0].matchOf.value).toEqual('one TWO');
          expect(matchResult[1].value).toEqual(' ');
          expect(matchResult[1].matchOf).toBeNull();
          expect(matchResult[2].value).toEqual('three');
          expect(matchResult[2].matchOf.value).toEqual('three');
        });
      });

      describe('several possible matches', () => {
        beforeEach(() => {
          stemmer = {
            stem: function (word) {
              return word;
            },
          };
          stemmers = new Map<string, Stemmer>([
            [Group.DEFAULT_SMART_MATCHING_LANGUAGE, stemmer],
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
              Group.DEFAULT_SMART_MATCHING_LANGUAGE
            ),
          ];
          matchFinder = new MatchFinderImpl(dictionary, stemmers, groups);
          matchFinder.buildIndexes();
        });

        describe('multiple possible matches starting from the same word', () => {
          beforeEach(() => {
            matchResult = matchFinder.findMatches('one two three four');
          });

          it('finds the longest match', () => {
            expect(matchResult.length).toEqual(2);
            expect(matchResult[0].value).toEqual('one two three');
            expect(matchResult[0].matchOf.value).toEqual('one two three');
            expect(matchResult[1].value).toEqual(' four');
            expect(matchResult[1].matchOf).toBeNull();
          });
        });
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

        let stemmerEn = {
          stem: function (word: string) {
            switch (word) {
              case 'cherries':
                return 'cherry';
              case 'apples':
                return 'apple';
              default:
                return word;
            }
          },
        };
        let stemmerEs = {
          stem: function (word: string) {
            switch (word) {
              case 'gatos':
                return 'gato';
              case 'perros':
                return 'perro';
              case 'vacas':
                return 'vaca';
              default:
                return word;
            }
          },
        };
        let stemmerRu = {
          stem: function (word: string) {
            switch (word) {
              case 'колоды':
                return 'колод';
              case 'колода':
                return 'колод';
              default:
                return word;
            }
          },
        };
        stemmers = new Map<string, Stemmer>([
          ['en', stemmerEn],
          ['es', stemmerEs],
          ['ru', stemmerRu],
        ]);
        matchFinder = new MatchFinderImpl(dictionary, stemmers, groups);
        matchFinder.buildIndexes();
      });

      function findWordMatch(input: string) {
        let result = matchFinder.findMatches(input);
        expect(result.length).toEqual(1);
        return result[0].matchOf ? result[0].matchOf.value : null;
      }

      describe('smart matching disabled for group', () => {
        it('finds exact match', () => {
          expect(findWordMatch('cherry')).toEqual('cherry');
          expect(findWordMatch('apple')).toEqual('apple');
          expect(findWordMatch('vaca')).toEqual('vaca');
        });

        it('does not do smart match', () => {
          expect(findWordMatch('cherries')).toBeNull();
          expect(findWordMatch('apples')).toBeNull();
          expect(findWordMatch('vacas')).toBeNull();
        });
      });

      describe('smart matching enabled for group', () => {
        it('finds exact match', () => {
          expect(findWordMatch('gato')).toEqual('gato');
          expect(findWordMatch('perro')).toEqual('perro');
          expect(findWordMatch('пень')).toEqual('пень');
          expect(findWordMatch('колоды')).toEqual('колоды');
        });

        it('finds stem match if not restricted to strict match', () => {
          expect(findWordMatch('gatos')).toEqual('gato');
          expect(findWordMatch('колода')).toEqual('колоды');
        });

        it('does not find stem match if restricted to strict match', () => {
          expect(findWordMatch('perros')).toBeNull();
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

      function findWordMatch(input: string) {
        let result = matchFinder.findMatches(input);
        expect(result.length).toEqual(1);
        return result[0].matchOf ? result[0].matchOf.value : null;
      }

      it('finds matches', () => {
        expect(findWordMatch('日本語')).toEqual('日本語');
      });
    });
  });
});
