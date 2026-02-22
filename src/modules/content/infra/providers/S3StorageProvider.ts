import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  FileNotFoundError,
  FileProcessingError,
  type IStorageProvider,
} from "../../domain";
import { S3ConnectionProvider } from "@/shared/infra/providers";

export class S3StorageProvider implements IStorageProvider {
  private client: S3Client;
  private bucketName: string;

  constructor(private connection: S3ConnectionProvider) {
    this.client = connection.client;
    this.bucketName = connection.bucketName;
  }

  async generatePresignedUploadUrl(params: {
    fileKey: string;
    contentType: string;
    size: number;
    filename: string;
    expiresInSeconds: number;
  }): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: params.fileKey,
      ContentType: params.contentType,
      ContentLength: params.size,
      Metadata: {
        "original-filename": params.filename,
      },
    });

    return await getSignedUrl(this.client, command, {
      expiresIn: params.expiresInSeconds,
    });
  }

  async getFileMetadata(
    fileKey: string,
  ): Promise<{ size: number; contentType: string; filename: string }> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      const response = await this.client.send(command);

      return {
        size: response.ContentLength || 0,
        contentType: response.ContentType || "application/octet-stream",
        filename:
          response.Metadata?.["original-filename"] ||
          fileKey.split("/").pop() ||
          "file",
      };
    } catch (error) {
      if (error instanceof Error && error.name === "NotFound") {
        throw new FileNotFoundError();
      }
      throw error;
    }
  }

  async moveFile(params: {
    sourceKey: string;
    destinationKey: string;
  }): Promise<void> {
    try {
      // 1. Copy the object
      const copyCommand = new CopyObjectCommand({
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${params.sourceKey}`,
        Key: params.destinationKey,
      });
      await this.client.send(copyCommand);

      // 2. Delete original
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: params.sourceKey,
        });
        await this.client.send(deleteCommand);
      } catch (deleteError) {
        // If delete fails after copy succeeded, the system is left with duplicate.
        // We log the error but we don't necessarily fail the operation since the copy was successful
        // and the post can be created. The redundant file is in temp/ and will be cleaned after 24h.
        console.error(
          `Failed to delete source file ${params.sourceKey} after copying:`,
          deleteError,
        );
      }
    } catch (error) {
      // If copy fails, we throw to abort post creation
      throw new FileProcessingError();
    }
  }

  getPublicUrl(fileKey: string): string {
    return this.connection.getPublicUrl(fileKey);
  }
}
