///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/matching/matchResultEntry.ts" />
///<reference path="../../src/lib/stats/pageStats.ts" />

describe('PageStats', () => {
    let stats: PageStats;

    describe('calculating word apparances', () => {
        let dictionaryEntry1 = new DictionaryEntry(1, 'word1', 'desc1', new Date(), new Date());
        let dictionaryEntry2 = new DictionaryEntry(2, 'word2', 'desc2', new Date(), new Date());
        let dictionaryEntry3 = new DictionaryEntry(3, 'word3', 'desc3', new Date(), new Date());

        beforeEach(() => {
            stats = new PageStats();
            stats.registerMatch(dictionaryEntry1);
            stats.registerMatch(dictionaryEntry2);
            stats.registerMatch(dictionaryEntry1);
            stats.registerMatch(dictionaryEntry1);
        });

        it('calculates word appearance stats', () => {
            expect(stats.wordAppearanceStats).toEqual([
                { dictionaryEntry: dictionaryEntry1, count: 3 },
                { dictionaryEntry: dictionaryEntry2, count: 1 }
            ]);
        });

        it ('calculates total appeared words', () => {
            expect(stats.totalAppearedWords).toEqual(2);
        });

        it ('calculates total appearances', () => {
            expect(stats.totalAppearances).toEqual(4);
        });
    });
});
