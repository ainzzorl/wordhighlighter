/**
 * Settings.
 */
class Settings {
    public static readonly DEFAULT_TIMEOUT = 3;
    public static readonly DEFAULT_ENABLE_HIGHLIGHTING = true;
    public static readonly DEFAULT_ENABLE_PAGE_STATS = true;

    public static readonly DEFAULT: Settings = new Settings(
        Settings.DEFAULT_TIMEOUT,
        Settings.DEFAULT_ENABLE_HIGHLIGHTING,
        Settings.DEFAULT_ENABLE_PAGE_STATS
    );

    private _timeout: number;
    private _enableHighlighting: boolean;
    private _enablePageStats: boolean;

    constructor(_timeout: number = undefined, _enableHighlighting: boolean = undefined, _enablePageStats: boolean = undefined) {
        this._timeout = _timeout;
        this._enableHighlighting = _enableHighlighting;
        this._enablePageStats = _enablePageStats;
    }

    get timeout(): number {
        return this._timeout;
    }

    set timeout(_timeout: number) {
        this._timeout = _timeout;
    }

    get enableHighlighting(): boolean {
        return this._enableHighlighting;
    }

    set enableHighlighting(_enableHighlighting: boolean) {
        this._enableHighlighting = _enableHighlighting;
    }

    get enablePageStats(): boolean {
        return this._enablePageStats;
    }

    set enablePageStats(_enablePageStats: boolean) {
        this._enablePageStats = _enablePageStats;
    }
}
