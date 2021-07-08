/**
 * A persistent entry in the dictionary.
 */
class DictionaryEntry {
  private _id: number;
  private _value: string;
  private _description: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _strictMatch: boolean;
  private _groupId: number;

  constructor(
    id: number,
    value: string,
    description: string,
    createdAt: Date = undefined,
    updatedAt: Date = undefined,
    strictMatch: boolean = false,
    groupId: number = 0
  ) {
    this._id = id;
    this._value = value;
    this._description = description;
    this._strictMatch = strictMatch;
    let now = new Date();
    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
    this._groupId = groupId || 0;
  }

  get id(): number {
    return this._id;
  }

  set id(_id: number) {
    this._id = _id;
  }

  get value(): string {
    return this._value;
  }

  set value(_value: string) {
    this._value = _value;
  }

  get description(): string {
    return this._description;
  }

  set description(_description: string) {
    this._description = _description;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(_createdAt: Date) {
    this._createdAt = _createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(_updatedAt: Date) {
    this._updatedAt = _updatedAt;
  }

  get strictMatch(): boolean {
    return this._strictMatch;
  }

  set strictMatch(_strictMatch: boolean) {
    this._strictMatch = _strictMatch;
  }

  get groupId(): number {
    return this._groupId;
  }

  set groupId(_groupId: number) {
    this._groupId = _groupId;
  }

  touch(): void {
    this._updatedAt = new Date();
  }
}
