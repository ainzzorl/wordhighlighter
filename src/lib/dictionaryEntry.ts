class DictionaryEntry {
    id: number; // TODO: getter/setter
    readonly value: string;
    readonly description: string;
    readonly createdAt: Date;
    updatedAt: Date; // TODO: instead of public, use touch()
    readonly strictMatch: boolean;

    constructor(id: number, value: string, description: string, createdAt: Date, updatedAt: Date, strictMatch: boolean = false) {
        this.id = id;
        this.value = value;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.strictMatch = strictMatch;
    }
}
