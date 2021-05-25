import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV,
  name: process.env.NAME,
  url: process.env.URL,
  port: process.env.PORT,
}));
