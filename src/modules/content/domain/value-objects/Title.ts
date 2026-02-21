import { InvalidTitleError } from "../errors";

export class Title {
  private readonly _value: string;

  private constructor(title: string) {
    this._value = title;
  }

  static create(title: string): Title {
    const trimmed = title.trim();
    if (!Title.validate(trimmed)) throw new InvalidTitleError();
    return new Title(trimmed);
  }

  static validate(title: string): boolean {
    return title.length >= 1 && title.length <= 120;
  }

  get value(): string {
    return this._value;
  }
}
