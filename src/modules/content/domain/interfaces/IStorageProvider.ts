export interface IStorageProvider {
  generatePresignedUploadUrl(params: {
    fileKey: string;
    contentType: string;
    size: number;
    expiresInSeconds: number;
  }): Promise<string>;

  fileExists(fileKey: string): Promise<boolean>;

  getPublicUrl(fileKey: string): string;
}
