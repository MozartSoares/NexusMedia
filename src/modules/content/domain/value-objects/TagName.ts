import { InvalidTagNameError } from "../errors";

const TAG_NAME_REGEX = /^[a-z0-9-]+$/;

export class TagName {
  private readonly _value: string;

  private constructor(name: string) {
    this._value = name;
  }

  static create(name: string): TagName {
    const normalized = name.trim().toLowerCase();
    if (!TagName.validate(normalized)) throw new InvalidTagNameError();
    return new TagName(normalized);
  }

  static validate(name: string): boolean {
    return name.length >= 1 && name.length <= 30 && TAG_NAME_REGEX.test(name);
  }

  get value(): string {
    return this._value;
  }
}
