class Tokenizer {
  tokenize(input: string): Array<Token> {
    let result: Array<Token> = [];
    let currentWord = '';
    let currentNonWord = '';
    for (let i = 0; i < input.length; ++i) {
      if (this.isNoSpaceLanguageCharacter(input[i])) {
        // In languages where spaces are usually not used (Chinese, Japanese)
        // we just assume that every symbol is a separate token.

        // Flush the previous token
        this.pushTokenIfNotEmpty(result, currentNonWord, false);
        this.pushTokenIfNotEmpty(result, currentWord, true);

        // New token
        currentWord = input[i];
        this.pushTokenIfNotEmpty(result, currentWord, true);

        currentNonWord = '';
        currentWord = '';
      } else if (this.isWordCharacter(input[i])) {
        this.pushTokenIfNotEmpty(result, currentNonWord, false);
        currentNonWord = '';
        currentWord += input[i];
      } else {
        this.pushTokenIfNotEmpty(result, currentWord, true);
        currentWord = '';
        currentNonWord += input[i];
      }
    }
    this.pushTokenIfNotEmpty(result, currentNonWord, false);
    this.pushTokenIfNotEmpty(result, currentWord, true);
    return result;
  }

  private isWordCharacter(char: string) {
    return (
      (char[0] >= '0' && char[0] <= '9') ||
      // Latin
      (char[0] >= 'a' && char[0] <= 'z') ||
      (char[0] >= 'A' && char[0] <= 'Z') ||
      // Russian
      (char[0] >= 'а' && char[0] <= 'я') ||
      (char[0] >= 'А' && char[0] <= 'Я') ||
      // Misc diacritics
      (char[0] >= 'À' && char[0] <= 'ÿ')
    );
  }

  private isNoSpaceLanguageCharacter(char: string) {
    // Chinese or Japanese
    return char[0].match(/[一-龠]|[ぁ-ゔ]|[ァ-ヴー]|[々〆〤]/);
  }

  private pushTokenIfNotEmpty(
    result: Array<Token>,
    value: string,
    isWord: boolean
  ) {
    if (value.length > 0) {
      result.push({
        value: value,
        isWord: isWord,
      });
    }
  }
}
