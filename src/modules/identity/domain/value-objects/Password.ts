export class Password {
  private readonly value: string;

  private constructor(password: string) {
    this.value = password;
  }

  static create(password: string): Password {
    if (!this.validate(password)) throw new Error("Invalid password format");
    return new Password(password);
  }

  static validate(password: string): boolean {
    return password.length >= 8;
  }

  get getValue(): string { return this.value; }
}