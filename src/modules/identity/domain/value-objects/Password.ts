import { InvalidPasswordError } from "../errors";

export class Password {
  private readonly _value: string;

  private constructor(password: string) {
    this._value = password;
  }

  static create(password: string): Password {
    if (!Password.validate(password)) throw new InvalidPasswordError();
    return new Password(password);
  }

  static validate(password: string): boolean {
    return password.length >= 8;
  }

  get value(): string {
    return this._value;
  }
}
