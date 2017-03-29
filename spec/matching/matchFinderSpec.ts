///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/matching/matchFinder.ts" />
///<reference path="../../src/lib/matching/matchResultEntry.ts" />
///<reference path="../../src/lib/common/dictionaryEntry.ts" />

// TODO: consider using real stemmer
describe('MatchFinder', function() {
    let matchFinder: MatchFinder;
    let stemmer: Stemmer;
    let dictionary: Array<DictionaryEntry>;
    let matchResult: Array<MatchResultEntry>;

    describe('findMatches', function() {
        describe('multiple words in the input', function() {
            beforeEach(function() {
                stemmer = {
                    stem: function(word) {
                        return word;
                    }
                };
                dictionary = [];
                dictionary.push(new DictionaryEntry(1, 'people', '', new Date(), new Date()));
                dictionary.push(new DictionaryEntry(2, 'profit', '', new Date(), new Date()));
                matchFinder = new MatchFinderImpl(dictionary, stemmer);
            });

            describe('1 match in the middle', function() {
                beforeEach(function() {
                    matchResult = matchFinder.findMatches('Internet for people, not');
                });

                it('finds the match', function() {
                    expect(matchResult.length).toEqual(3);
                    expect(matchResult[0].value).toEqual('Internet for ');
                    expect(matchResult[0].matchOf).toBeNull();
                    expect(matchResult[1].value).toEqual('people');
                    expect(matchResult[1].matchOf.value).toEqual('people');
                    expect(matchResult[2].value).toEqual(', not');
                    expect(matchResult[2].matchOf).toBeNull();
                });
            });

            describe('no match', function() {
                beforeEach(function() {
                    matchResult = matchFinder.findMatches('Text that does not match');
                });

                it('detects that there is no match', function() {
                    expect(matchResult.length).toEqual(1);
                    expect(matchResult[0].value).toEqual('Text that does not match');
                    expect(matchResult[0].matchOf).toBeNull();
                });
            });

            describe('all string is a match', function() {
                beforeEach(function() {
                    matchResult = matchFinder.findMatches('people');
                });

                it('finds the match', function() {
                    expect(matchResult.length).toEqual(1);
                    expect(matchResult[0].value).toEqual('people');
                    expect(matchResult[0].matchOf.value).toEqual('people');
                });
            });

            describe('match in the beginning', function() {
                beforeEach(function() {
                    matchResult = matchFinder.findMatches('people and');
                });

                it('finds the match', function() {
                    expect(matchResult.length).toEqual(2);
                    expect(matchResult[0].value).toEqual('people');
                    expect(matchResult[0].matchOf.value).toEqual('people');
                    expect(matchResult[1].value).toEqual(' and');
                    expect(matchResult[1].matchOf).toBeNull();
                });
            });

            describe('match in the end', function() {
                beforeEach(function() {
                    matchResult = matchFinder.findMatches('not profit');
                });

                it('finds the match', function() {
                    expect(matchResult.length).toEqual(2);
                    expect(matchResult[0].value).toEqual('not ');
                    expect(matchResult[0].matchOf).toBeNull();
                    expect(matchResult[1].value).toEqual('profit');
                    expect(matchResult[1].matchOf.value).toEqual('profit');
                });
            });
        });

        describe('one words in the input', function() {
            beforeEach(function() {
                dictionary = [];
                dictionary.push(new DictionaryEntry(1, 'advent', '', new Date(), new Date()));
                dictionary.push(new DictionaryEntry(2, 'something', '', new Date(), new Date()));
                dictionary.push(new DictionaryEntry(3, 'To hamper', '', new Date(), new Date()));
                dictionary.push(new DictionaryEntry(4, 'go to', '', new Date(), new Date()));
                dictionary.push(new DictionaryEntry(5, 'Contention', '', new Date(), new Date(), true));
                stemmer = {
                    stem: function(word) {
                        switch (word) {
                            case 'advent': return 'advent';
                            case 'advents': return 'advent';
                            case 'adventure': return 'adventur';
                        }
                        if (word.toLowerCase().indexOf('content') === 0) {
                            return 'content';
                        }
                        return word;
                    }
                };
                matchFinder = new MatchFinderImpl(dictionary, stemmer);
            });

            // TODO: comment
            function findWordMatch(input: string) {
                let result = matchFinder.findMatches(input);
                // TODO: error message
                expect(result.length).toEqual(1);
                return result[0].matchOf ? result[0].matchOf.value : null;
            }

            describe('stem matching', function() {
                it('finds exact match', function() {
                    expect(findWordMatch('advent')).toEqual('advent');
                });

                it('finds stem match', function() {
                    expect(findWordMatch('advents')).toEqual('advent');
                });

                it('detects no match', function() {
                    expect(findWordMatch('adventure')).toBeNull();
                });

                it('ignores "to" at the beginning', function() {
                    expect(findWordMatch('hamper')).toEqual('To hamper');
                });

                it('does not ignore "to" elsewhere', function() {
                    expect(findWordMatch('go')).toBeNull();
                });
            });

            describe('strict matching', function() {
                it('finds exact match', function() {
                    expect(findWordMatch('contention')).toEqual('Contention');
                });

                it('ignores case', function() {
                    expect(findWordMatch('cOnTeNtIoN')).toEqual('Contention');
                });

                it('does not find stem match', function() {
                    expect(findWordMatch('content')).toBeNull();
                });
            });

        });
    });
});
