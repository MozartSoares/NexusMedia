import bcrypt from "bcryptjs";

export class BCryptHashProvider {
  private salt = Number(process.env.BCRYPT_SALT);

  async hash(payload: string): Promise<string> {
    return bcrypt.hash(payload, this.salt);
  }

  async compare(payload: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(payload, hashed);
  }
}
