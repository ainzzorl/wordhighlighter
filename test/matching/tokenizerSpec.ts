///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/matching/tokenizer.ts" />
///<reference path="../../src/lib/matching/token.ts" />

describe('Tokenizer', () => {
  let tokenizer: Tokenizer = new Tokenizer();

  describe('tokenize', () => {
    describe('English', () => {
      it('tokenizes single word', () => {
        expect(tokenizer.tokenize('hello')).toEqual([
          { value: 'hello', isWord: true },
        ]);
      });

      it('tokenizes multiple words', () => {
        expect(tokenizer.tokenize('  hello  my-name is JoHN... ')).toEqual([
          { value: '  ', isWord: false },
          { value: 'hello', isWord: true },
          { value: '  ', isWord: false },
          { value: 'my', isWord: true },
          { value: '-', isWord: false },
          { value: 'name', isWord: true },
          { value: ' ', isWord: false },
          { value: 'is', isWord: true },
          { value: ' ', isWord: false },
          { value: 'JoHN', isWord: true },
          { value: '... ', isWord: false },
        ]);
      });
    });

    describe('Russian', () => {
      it('tokenizes Russian', () => {
        expect(tokenizer.tokenize('Слова по-русски')).toEqual([
          { value: 'Слова', isWord: true },
          { value: ' ', isWord: false },
          { value: 'по', isWord: true },
          { value: '-', isWord: false },
          { value: 'русски', isWord: true },
        ]);
      });
    });

    describe('Spanish', () => {
      it('tokenizes Spanish', () => {
        expect(tokenizer.tokenize('aprendió Español')).toEqual([
          { value: 'aprendió', isWord: true },
          { value: ' ', isWord: false },
          { value: 'Español', isWord: true },
        ]);
      });
    });

    describe('Chinese', () => {
      it('tokenizes Chinese', () => {
        expect(tokenizer.tokenize('对不起，我不会说中文')).toEqual([
          { value: '对', isWord: true },
          { value: '不', isWord: true },
          { value: '起', isWord: true },
          { value: '，', isWord: false },
          { value: '我', isWord: true },
          { value: '不', isWord: true },
          { value: '会', isWord: true },
          { value: '说', isWord: true },
          { value: '中', isWord: true },
          { value: '文', isWord: true },
        ]);
      });

      it('tokenizes Chinese mixed with English', () => {
        expect(tokenizer.tokenize('I think 你好 means hello')).toEqual([
          { value: 'I', isWord: true },
          { value: ' ', isWord: false },
          { value: 'think', isWord: true },
          { value: ' ', isWord: false },
          { value: '你', isWord: true },
          { value: '好', isWord: true },
          { value: ' ', isWord: false },
          { value: 'means', isWord: true },
          { value: ' ', isWord: false },
          { value: 'hello', isWord: true },
        ]);
      });
    });

    describe('Japanese', () => {
      it('tokenizes Japanese', () => {
        expect(tokenizer.tokenize('日本語は難しい')).toEqual([
          { value: '日', isWord: true },
          { value: '本', isWord: true },
          { value: '語', isWord: true },
          { value: 'は', isWord: true },
          { value: '難', isWord: true },
          { value: 'し', isWord: true },
          { value: 'い', isWord: true },
        ]);
      });
    });

    describe('Misc diacritics', () => {
      it('tokenizes words with diacritics', () => {
        expect(
          tokenizer.tokenize('Aragonés Čeština Lietuvių Português Türkçe')
        ).toEqual([
          { value: 'Aragonés', isWord: true },
          { value: ' ', isWord: false },
          { value: 'Čeština', isWord: true },
          { value: ' ', isWord: false },
          { value: 'Lietuvių', isWord: true },
          { value: ' ', isWord: false },
          { value: 'Português', isWord: true },
          { value: ' ', isWord: false },
          { value: 'Türkçe', isWord: true },
        ]);
      });
    });
  });
});
