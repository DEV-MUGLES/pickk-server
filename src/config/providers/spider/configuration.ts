import { registerAs } from '@nestjs/config';

export default registerAs('spider', () => ({
  url: process.env.SPIDER_URL,
}));
