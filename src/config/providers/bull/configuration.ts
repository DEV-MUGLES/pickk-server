import { registerAs } from '@nestjs/config';

export default registerAs('bull', () => ({
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
}));
