export type UploadTokenPayload = {
  userId: string;
  fileKey: string;
  purpose: "post_upload";
};

export interface IUploadTokenProvider {
  generateToken(payload: UploadTokenPayload, expiresInSeconds?: number): string;
  verifyToken(token: string): UploadTokenPayload | null;
}
