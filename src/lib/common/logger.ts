/**
 * Logger.
 * Does nothing by default.
 * Set debug=true to see the logs.
 */
class WHLogger {
  private static debug: boolean = false;

  static log(message: string): void {
    if (this.debug) {
      console.log(message);
    }
  }
}
