export interface IStorageProvider {
  generatePresignedUploadUrl(params: {
    fileKey: string;
    contentType: string;
    size: number;
    filename: string;
    expiresInSeconds: number;
  }): Promise<string>;

  getFileMetadata(
    fileKey: string,
  ): Promise<{ size: number; contentType: string; filename: string }>;

  moveFile(params: {
    sourceKey: string;
    destinationKey: string;
  }): Promise<void>;

  getPublicUrl(fileKey: string): string;
}
