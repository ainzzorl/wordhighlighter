class DictionaryEntry {
    readonly id: number;
    readonly value: string;
    readonly desciption: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(id: number, value: string, description: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.value = value;
        this.desciption = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
