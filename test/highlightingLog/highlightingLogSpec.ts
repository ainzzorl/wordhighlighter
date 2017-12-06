///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/highlightingLog/highlightingLog.ts" />

describe('highlightingLog', () => {
    let highlightingLog: HighlightingLog;

    // Everything else is tested via content spec.
    describe('logging many records', () => {
        let LIMIT = 100 * 1000;
        let MANY = LIMIT * 10;

        beforeEach(() => {
            highlightingLog = new HighlightingLog();
            for (let i = 0; i < MANY; i++) {
                highlightingLog.log(new PageStats());
            }
        });

        it('stores only a limited number of records', () => {
            expect(highlightingLog.entries.length).toEqual(LIMIT);
        });
    });
});
