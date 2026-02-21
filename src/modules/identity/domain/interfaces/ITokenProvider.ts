export type TokenPayload = {
  sub: string;
  username:string
};
export interface ITokenProvider {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload | null;
}