import { registerAs } from '@nestjs/config';

export default registerAs('aws-s3', () => ({
  region: process.env.AWS_S3_REGION,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  publicBucketName: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
}));
