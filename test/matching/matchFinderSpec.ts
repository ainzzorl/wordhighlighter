///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/matching/matchFinder.ts" />
///<reference path="../../src/lib/matching/matchResultEntry.ts" />
///<reference path="../../src/lib/common/dictionaryEntry.ts" />

// TODO: consider using real stemmer
describe('MatchFinder', () => {
  let matchFinder: MatchFinder;
  let stemmer: Stemmer;
  let dictionary: Array<DictionaryEntry>;
  let matchResult: Array<MatchResultEntry>;

  describe('findMatches', () => {
    describe('multiple words in the input', () => {
      beforeEach(() => {
        stemmer = {
          stem: function (word) {
            return word;
          },
        };
        dictionary = [];
        dictionary.push(
          new DictionaryEntry(1, 'people', '', new Date(), new Date())
        );
        dictionary.push(
          new DictionaryEntry(2, 'profit', '', new Date(), new Date())
        );
        // Chinese
        dictionary.push(
          new DictionaryEntry(3, '中文', '', new Date(), new Date())
        );
        // Japanese
        dictionary.push(
          new DictionaryEntry(4, '日本語', '', new Date(), new Date())
        );
        // Russian
        dictionary.push(
          new DictionaryEntry(5, 'русский', '', new Date(), new Date())
        );
        matchFinder = new MatchFinderImpl(dictionary, stemmer);
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
        matchFinder = new MatchFinderImpl(dictionary, stemmer);
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
        matchFinder = new MatchFinderImpl(dictionary, stemmer);
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
    });
  });
});
