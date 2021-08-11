import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

import configuration from './configuration';
import { CrawlerConfigService } from './config.service';

/**
 * Import and provide crawler configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        CRAWLER_URL: Joi.string().default('https://crawl.pickk.one/api'),
      }),
    }),
  ],
  providers: [ConfigService, CrawlerConfigService],
  exports: [ConfigService, CrawlerConfigService],
})
export class CrawlerConfigModule {}
