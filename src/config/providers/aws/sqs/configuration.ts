import { registerAs } from '@nestjs/config';

export default registerAs('aws-sqs', () => ({
  region: process.env.AWS_SQS_REGION,
  accessKeyId: process.env.AWS_SQS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SQS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_SQS_END_POINT,
  accountNumber: process.env.AWS_SQS_ACCOUNT_NUMBER,
}));
