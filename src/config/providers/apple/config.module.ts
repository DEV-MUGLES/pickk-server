import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

import configuration from './configuration';
import { AppleConfigService } from './config.service';

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
        APPLE_APP_BUNDLE_ID: Joi.string().default('hi-im-app-bundle-id'),
        APPLE_WEB_BUNDLE_ID: Joi.string().default('hi-im-web-bundle-id'),
        APPLE_TEAM_ID: Joi.string().default('hi-im-team-id'),
        APPLE_KEY_ID: Joi.string().default('hi-im-key-id'),
        SECRET: Joi.string().default('hi-im-secret'),
      }),
    }),
  ],
  providers: [ConfigService, AppleConfigService],
  exports: [ConfigService, AppleConfigService],
})
export class AppleConfigModule {}
