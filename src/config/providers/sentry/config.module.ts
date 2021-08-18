import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

import configuration from './configuration';
import { SentryConfigService } from './config.service';

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
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        SENTRY_DSN: Joi.string().default(
          'https://9a0f3913ac834a36963aaffc341e583d@o350527.ingest.sentry.io/5838776'
        ),
      }),
    }),
  ],
  providers: [ConfigService, SentryConfigService],
  exports: [ConfigService, SentryConfigService],
})
export class SentryConfigModule {}
