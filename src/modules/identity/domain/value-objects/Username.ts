import { InvalidUsernameError } from "../errors";

export class Username {
  private readonly _value: string;

  private constructor(username: string) {
    this._value = username;
  }

  static create(username: string): Username {
    if (!Username.validate(username)) throw new InvalidUsernameError();
    return new Username(username);
  }

  static validate(username: string): boolean {
    return username.length >= 3;
  }

  get value(): string {
    return this._value;
  }
}
