enum MatchingType {
  STRICT = 'STRICT',
  SMART = 'SMART',
}

/**
 * A persistent group.
 */
class Group {
  public static readonly DEFAULT_GROUP_ID = 1;
  public static readonly DEFAULT_MATCHING_TYPE = MatchingType.SMART;
  public static readonly DEFAULT_MATCHING_LANGUAGE = 'en';

  private _id: number;
  private _name: string;
  private _backgroundColor: string;
  private _matchingType: MatchingType;
  private _matchingLanguage: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number,
    name: string,
    backgroundColor: string,
    matchingType: MatchingType,
    matchingLanguage: string,
    createdAt: Date = undefined,
    updatedAt: Date = undefined
  ) {
    this._id = id;
    this._name = name;
    this._backgroundColor = backgroundColor;
    this._matchingType = matchingType;
    this._matchingLanguage = matchingLanguage;
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

  get matchingType(): MatchingType {
    return this._matchingType;
  }

  set matchingType(_matchingType: MatchingType) {
    this._matchingType = _matchingType;
  }

  get matchingLanguage(): string {
    return this._matchingLanguage;
  }

  set matchingLanguage(_matchingLanguage: string) {
    this._matchingLanguage = _matchingLanguage;
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
