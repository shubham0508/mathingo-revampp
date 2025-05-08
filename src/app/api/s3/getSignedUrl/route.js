import { NextResponse } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/config/s3Config';

const fileExistenceCache = new Map();
const FILE_EXISTENCE_CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function checkFileExists(bucket, key) {
  const cacheKey = `${bucket}:${key}`;
  const now = Date.now();

  const cachedResult = fileExistenceCache.get(cacheKey);
  if (cachedResult && cachedResult.expires > now) {
    return cachedResult.exists;
  }

  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    fileExistenceCache.set(cacheKey, {
      exists: true,
      expires: now + FILE_EXISTENCE_CACHE_TTL,
    });

    return true;
  } catch (error) {
    if (error.name === 'NotFound') {
      fileExistenceCache.set(cacheKey, {
        exists: false,
        expires: now + FILE_EXISTENCE_CACHE_TTL / 2,
      });
      return false;
    }
    throw error;
  }
}

export async function POST(request) {
  try {
    const { fileUrl } = await request.json();

    if (!fileUrl) {
      return NextResponse.json(
        { error: 'File URL is required' },
        { status: 400 },
      );
    }

    const bucket = process.env.S3_BUCKET_NAME;

    const exists = await checkFileExists(bucket, fileUrl);
    if (!exists) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileUrl,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 24 * 60 * 60,
    });

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 },
    );
  }
}
