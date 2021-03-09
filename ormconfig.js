module.exports = {
  type: 'mysql',
  host: process.env.TYPEORM_CLI_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ['src/**/*.entity.ts', 'src/**/*.entity.js'],
  migrations: ['src/database/migrations/*.ts', 'src/database/migrations/*.js'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};
