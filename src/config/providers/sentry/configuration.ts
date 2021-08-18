import { registerAs } from '@nestjs/config';

export default registerAs('sentry', () => ({
  environment: process.env.NODE_ENV,
  dsn: process.env.SENTRY_DSN,
}));
