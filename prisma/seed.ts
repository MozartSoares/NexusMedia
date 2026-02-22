import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { hashProvider } from "../src/shared/infra";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Setup standalone S3 client for seeding to ensure env vars are picked up correctly
const s3Config = {
  endpoint: process.env.STORAGE_ENDPOINT || "http://localhost:9000",
  region: process.env.STORAGE_REGION || "auto",
  accessKeyId: process.env.STORAGE_ACCESS_KEY || "minioadmin",
  secretAccessKey: process.env.STORAGE_SECRET_KEY || "minioadmin",
  bucketName: process.env.STORAGE_BUCKET_NAME || "nexusmedia-content",
};

const s3Client = new S3Client({
  endpoint: s3Config.endpoint,
  region: s3Config.region,
  credentials: {
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey,
  },
  forcePathStyle: true,
});

async function downloadImage(): Promise<{ buffer: Buffer; mime: string }> {
  // Use picsum for random realistic photos. Added a random param to avoid caching
  const url = `https://picsum.photos/seed/${faker.string.uuid()}/800/600`;
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch image: ${response.statusText}`);

  const arrayBuffer = await response.arrayBuffer();
  const mime = response.headers.get("content-type") || "image/jpeg";
  return { buffer: Buffer.from(arrayBuffer), mime };
}

async function uploadToMinIO(key: string, buffer: Buffer, mime: string) {
  const command = new PutObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
    Body: buffer,
    ContentType: mime,
  });
  await s3Client.send(command);
}

async function main() {
  console.log("🧹 Cleaning up old data...");
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const numUsers = 10;
  // Increase posts per user so we have enough for infinite scroll testing
  const postsPerUser = 8;

  console.log(`👤 Generating ${numUsers} users...`);
  const users = [];

  for (let i = 0; i < numUsers; i++) {
    const password_hash = await hashProvider.hash("Password123!");

    const user = await prisma.user.create({
      data: {
        id: createId(),
        email: faker.internet.email().toLowerCase(),
        username: faker.internet
          .username()
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, ""),
        password_hash,
        created_at: faker.date.past({ years: 1 }),
      },
    });
    users.push(user);
    console.log(`Created user: ${user.username}`);
  }

  console.log(
    `📸 Generating ~${numUsers * postsPerUser} posts and uploading images...`,
  );

  const possibleTags = [
    "nature",
    "architecture",
    "portrait",
    "urban",
    "street",
    "macro",
    "landscape",
    "blackandwhite",
    "vintage",
    "film",
    "cyberpunk",
    "pets",
    "food",
    "travel",
    "art",
    "minimalism",
    "neon",
  ];

  let postCount = 0;

  for (const user of users) {
    for (let p = 0; p < postsPerUser; p++) {
      try {
        const { buffer, mime } = await downloadImage();

        const postId = createId();
        const ext = mime.split("/")[1] || "jpg";
        const date = new Date();
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");

        // Exact format requirement: uploads/posts/{userId}/{year}/{month}/{day}/{randomId}.{ext}
        const storagePath = `uploads/posts/${user.id}/${year}/${month}/${day}/${postId}.${ext}`;
        const title = faker.lorem.sentence({ min: 3, max: 8 }).replace(".", "");

        // Randomly select 1-4 tags
        const numTags = faker.number.int({ min: 1, max: 4 });
        const tags = faker.helpers.arrayElements(possibleTags, numTags);

        console.log(`Uploading image for post: "${title}"...`);
        await uploadToMinIO(storagePath, buffer, mime);

        // Created date spread over the last month to ensure cursor pagination sorting is realistic
        const createdAt = faker.date.recent({ days: 30 });

        await prisma.post.create({
          data: {
            id: postId,
            title,
            storage_path: storagePath,
            filename: `${postId}.${ext}`,
            author_id: user.id,
            size: buffer.length,
            tags,
            mime_type: mime,
            status: "PUBLISHED",
            created_at: createdAt,
          },
        });

        postCount++;
      } catch (err) {
        console.error(
          `Failed to create a post for user ${user.username}:`,
          err,
        );
      }
    }
  }

  console.log(
    `✅ Seed complete! Created ${users.length} users and ${postCount} posts.`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
