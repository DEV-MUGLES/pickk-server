import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

import configuration from './configuration';
import { ElasticsearchConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        ELASTICSEARCH_NODE: Joi.string().default('http://localhost:9200'),
        ELASTICSEARCH_PORT: Joi.number().default(9200),
        ELASTICSEARCH_USERNAME: Joi.string().default('elastic'),
        ELASTIC_PASSWORD: Joi.string().default('pickkdev123'),
      }),
    }),
  ],
  providers: [ConfigService, ElasticsearchConfigService],
  exports: [ConfigService, ElasticsearchConfigService],
})
export class ElasticsearchConfigModule {}
