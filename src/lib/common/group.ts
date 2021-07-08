/**
 * A persistent group.
 */
class Group {
  public static readonly DEFAULT_GROUP_ID = 1;

  private _id: number;
  private _name: string;
  private _backgroundColor: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number,
    name: string,
    backgroundColor: string,
    createdAt: Date = undefined,
    updatedAt: Date = undefined
  ) {
    this._id = id;
    this._name = name;
    this._backgroundColor = backgroundColor;
    let now = new Date();
    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
  }

  get id(): number {
    return this._id;
  }

  set id(_id: number) {
    this._id = _id;
  }

  get name(): string {
    return this._name;
  }

  set name(_name: string) {
    this._name = _name;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  set backgroundColor(_backgroundColor: string) {
    this._backgroundColor = _backgroundColor;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(_updatedAt: Date) {
    this._updatedAt = _updatedAt;
  }
}
