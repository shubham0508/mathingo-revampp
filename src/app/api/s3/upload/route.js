import { NextResponse } from 'next/server';
import { PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/config/s3Config';
import { getToken } from 'next-auth/jwt';

function generateFileKey(userId, originalName, type) {
  const timestamp = Date.now();
  const fileExtension = originalName.split('.').pop();
  return `${process.env.NODE_ENV}/${type}/${userId}_${timestamp}.${fileExtension}`;
}

async function fileExists(bucket, key) {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    return true;
  } catch (error) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
}

export async function POST(req) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files');
    const type = formData.get('type') || 'ha_questions';
    const uniqueFiles = formData.get('uniqueFiles') === 'true';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const bucket = process.env.S3_BUCKET_NAME;
    const userId = token.id; // Using user ID from the token

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileKey = generateFileKey(userId, file.name, type);

        if (uniqueFiles) {
          const exists = await fileExists(bucket, fileKey);
          if (exists) {
            return {
              originalName: file.name,
              fileKey,
              alreadyExists: true,
            };
          }
        }

        await s3Client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: fileKey,
            Body: fileBuffer,
            ContentType: file.type,
            CacheControl: 'max-age=3600',
          }),
        );

        return {
          originalName: file.name,
          fileKey,
          alreadyExists: false,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      files: uploadResults,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
