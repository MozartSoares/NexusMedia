import { InvalidEmailError } from "../errors";

export class Email {
  private readonly _value: string;

  private constructor(email: string) {
    this._value = email;
  }

  static create(email: string): Email {
    if (!Email.validate(email)) throw new InvalidEmailError();
    return new Email(email);
  }

  static validate(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get value(): string {
    return this._value;
  }
}
