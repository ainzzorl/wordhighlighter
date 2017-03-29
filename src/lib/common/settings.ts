/**
 * Settings.
 */
class Settings {
    private _timeout: number;
    private _enableHighlighting: boolean;

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
}
