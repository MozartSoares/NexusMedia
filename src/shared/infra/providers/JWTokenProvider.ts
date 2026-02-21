import jwt from "jsonwebtoken";

type TokenPayload = {
  [key: string]: unknown;
};
export class JWTokenProvider {
  private secret = process.env.JWT_SECRET as string;
  generateToken(payload: TokenPayload, expiresInSeconds?: number): string {
    if (expiresInSeconds) {
      return jwt.sign(payload, this.secret, { expiresIn: expiresInSeconds });
    }
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
