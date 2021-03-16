import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import configuration from './configuration';
import { MysqlConfigService } from './config.service';

/**
 * Import and provide postgres configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        MYSQL_HOST: Joi.string().default('mysql'),
        MYSQL_PORT: Joi.number().default(3306),
        MYSQL_USERNAME: Joi.string().default('pickkdev'),
        MYSQL_PASSWORD: Joi.string().default('pickkdev123'),
        MYSQL_DATABASE: Joi.string().default('pickk_dev'),
        MYSQL_LOGGING: Joi.boolean().default(true),
      }),
    }),
  ],
  providers: [ConfigService, MysqlConfigService],
  exports: [ConfigService, MysqlConfigService],
})
export class MysqlConfigModule {}
