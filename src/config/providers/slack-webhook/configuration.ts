import { registerAs } from '@nestjs/config';

export default registerAs('slackWebhook', () => ({
  url: process.env.SLACK_WEBHOOK_URL,
}));
