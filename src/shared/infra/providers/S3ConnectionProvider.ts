import { S3Client } from "@aws-sdk/client-s3";

const s3Config = {
  endpoint: process.env.STORAGE_ENDPOINT || "http://localhost:9000",
  region: process.env.STORAGE_REGION || "auto",
  accessKeyId: process.env.STORAGE_ACCESS_KEY || "minioadmin",
  secretAccessKey: process.env.STORAGE_SECRET_KEY || "minioadmin",
  bucketName: process.env.STORAGE_BUCKET_NAME || "nexusmedia-content",
  publicUrl:
    process.env.STORAGE_PUBLIC_URL ||
    "http://localhost:9000/nexusmedia-content",
};

export class S3ConnectionProvider {
  public readonly client: S3Client;
  public readonly bucketName: string;
  public readonly publicUrl: string;
  constructor() {
    this.client = new S3Client({
      endpoint: s3Config.endpoint,
      region: s3Config.region,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
      forcePathStyle: true, // For MinIO/R2 compatibility
    });
    this.bucketName = s3Config.bucketName;
    this.publicUrl = s3Config.publicUrl;
  }

  getPublicUrl(fileKey: string): string {
    const base = this.publicUrl.endsWith("/")
      ? this.publicUrl.slice(0, -1)
      : this.publicUrl;
    return `${base}/${fileKey}`;
  }
}
