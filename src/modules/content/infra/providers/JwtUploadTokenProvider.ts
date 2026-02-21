import { JWTokenProvider } from "@/shared/infra/providers/";
import type { IUploadTokenProvider, UploadTokenPayload } from "../../domain";

export class JwtUploadTokenProvider implements IUploadTokenProvider {
  private tokenProvider = new JWTokenProvider();

  generateToken(payload: UploadTokenPayload, expiresInSeconds = 3600): string {
    return this.tokenProvider.generateToken(payload, expiresInSeconds);
  }

  verifyToken(token: string): UploadTokenPayload | null {
    const decoded = this.tokenProvider.verifyToken(token);
    if (!decoded || decoded.purpose !== "post_upload") {
      return null;
    }
    return decoded as UploadTokenPayload;
  }
}
