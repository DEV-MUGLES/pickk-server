import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import configuration from './configuration';
import { SpiderConfigService } from './config.service';

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
        SPIDER_URL: Joi.string().default('https://spider.pickk.dev'),
      }),
    }),
  ],
  providers: [ConfigService, SpiderConfigService],
  exports: [ConfigService, SpiderConfigService],
})
export class SpiderConfigModule {}
