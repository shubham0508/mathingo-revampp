import { S3Client } from '@aws-sdk/client-s3';

let s3ClientInstance = null;

export const getS3Client = () => {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
    });
  }
  return s3ClientInstance;
};

export const s3Client = getS3Client();
