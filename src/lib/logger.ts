class WHLogger {
    private static debug: boolean = false;

    static log(message: string): void {
        if (this.debug) {
            console.log(message);
        }
    }
}
