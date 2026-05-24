/**
 * S3-compatible storage uploader. Works with AWS S3 and Cloudflare R2.
 */
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

let _client: S3Client | null = null;
function client(): S3Client {
  if (_client) return _client;
  _client = new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT, // set for R2
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    },
  });
  return _client;
}

export type UploadResult = { url: string; key: string };

export async function upload(opts: {
  buffer: Buffer;
  key: string;
  contentType: string;
  cacheControl?: string;
}): Promise<UploadResult> {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error("S3_BUCKET not set");
  const publicBase = process.env.S3_PUBLIC_URL ?? "";

  await client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: opts.key,
      Body: opts.buffer,
      ContentType: opts.contentType,
      CacheControl: opts.cacheControl ?? "public, max-age=31536000, immutable",
    })
  );

  const url = publicBase ? `${publicBase.replace(/\/$/, "")}/${opts.key}` : `https://${bucket}.s3.amazonaws.com/${opts.key}`;
  return { url, key: opts.key };
}
