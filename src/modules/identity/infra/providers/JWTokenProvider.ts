import jwt from "jsonwebtoken";
import { ITokenProvider,TokenPayload } from "../../domain/interfaces/ITokenProvider";

export class JWTokenProvider implements ITokenProvider {
  private secret = process.env.JWT_SECRET as string;
  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret);
  }
  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch (error) {
      // can log here if is invalid
      return null;
    }
  }
}