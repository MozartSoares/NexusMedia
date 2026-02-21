import bcrypt from "bcryptjs";
import { IHashProvider } from "../../domain";

export class BCryptHashProvider implements IHashProvider {
  private salt = 10;

  async hash(payload: string): Promise<string> {
    return bcrypt.hash(payload, this.salt);
  }

  async compare(payload: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(payload, hashed);
  }
}