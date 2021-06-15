import { registerAs } from '@nestjs/config';

export default registerAs('mysql', () => ({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  logging: process.env.MYSQL_LOGGING === 'true',
  migrationsRun: process.env.MYSQL_MIGRATIONS_RUN === 'true',
  caches: process.env.MYSQL_CACHES,
}));
