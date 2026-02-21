export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  static create(email: string): Email {
    if (!Email.validate(email)) throw new Error("Invalid email format");
    return new Email(email);
  }

  static validate(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get getValue(): string {
    return this.value;
  }
}
