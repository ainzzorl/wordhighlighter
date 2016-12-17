class DictionaryEntry {
    id: number; // TODO: getter/setter
    value: string;
    description: string;
    createdAt: Date;
    updatedAt: Date; // TODO: instead of public, use touch()
    strictMatch: boolean;

    constructor(id: number, value: string, description: string, createdAt: Date, updatedAt: Date, strictMatch: boolean = false) {
        this.id = id;
        this.value = value;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.strictMatch = strictMatch;
    }
}
