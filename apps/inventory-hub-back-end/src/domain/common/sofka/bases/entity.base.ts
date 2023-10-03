export abstract class EntityBase<Type> {
  private _id: Type;
  constructor(value?: Type) {
    if (value) this._id = value;
  }

  equals(id: Type): boolean {
    return this._id === id;
  }

  get id(): Type {
    return this._id;
  }

  set id(value: Type) {
    this._id = value;
  }
}
