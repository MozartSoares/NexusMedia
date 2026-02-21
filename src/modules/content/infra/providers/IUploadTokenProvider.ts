import type { IUploadTokenProvider, UploadTokenPayload } from "../../domain";
import { JWTokenProvider } from "@/shared/infra/providers/index";

export class JwtUploadTokenProvider implements IUploadTokenProvider {
  constructor(private tokenProvider: JWTokenProvider) {}

  generateToken(payload: UploadTokenPayload, expiresInSeconds = 3600): string {
    return this.tokenProvider.generateToken(payload, expiresInSeconds);
  }

  verifyToken(token: string): UploadTokenPayload | null {
    try {
      const decoded = this.tokenProvider.verifyToken(token);
      if (decoded.purpose !== "post_upload") {
        return null;
      }
      return decoded;
    } catch {
      return null;
    }
  }
}
