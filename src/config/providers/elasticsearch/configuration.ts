import { registerAs } from '@nestjs/config';

export default registerAs('elasticsearch', () => ({
  node: process.env.ELASTICSEARCH_NODE,
  port: process.env.ELASTICSEARCH_PORT,
  username: process.env.ELASTICSEARCH_USERNAME,
  password: process.env.ELASTIC_PASSWORD,
}));
