import { InvalidPasswordError } from "../errors";

export class Password {
  private readonly value: string;

  private constructor(password: string) {
    this.value = password;
  }

  static create(password: string): Password {
    if (!Password.validate(password)) throw new InvalidPasswordError();
    return new Password(password);
  }

  static validate(password: string): boolean {
    return password.length >= 8;
  }

  get getValue(): string {
    return this.value;
  }
}
