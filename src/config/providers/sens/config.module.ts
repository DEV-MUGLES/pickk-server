import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

import configuration from './configuration';
import { SensConfigService } from './config.service';

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
        NCLOUD_ACCESS_KEY: Joi.string().default('iZ5COoMGOLdRkJlkaRnk'),
        NCLOUD_SECRET_KEY: Joi.string().default(
          'oNOATRhCkchhKztOUcS5mY5sH2bfLv15JADrKUEO'
        ),
        NCLOUD_SMS_SERVICE_ID: Joi.string().default(
          'ncp:sms:kr:256885043930:pickk'
        ),
        NCLOUD_SMS_SECRET_KEY: Joi.string().default(
          '363c508ff3de4e22bfba71ac4b43b6e7'
        ),
        NCLOUD_SMS_CALLING_NUMBER: Joi.string().default('07088381445'),
        NCLOUD_ALIMTALK_SERVICE_ID: Joi.string().default(
          'ncp:kkobizmsg:kr:2568850:pickk'
        ),
        PLUS_FRIEND_ID: Joi.string().default('@pickk'),
      }),
    }),
  ],
  providers: [ConfigService, SensConfigService],
  exports: [ConfigService, SensConfigService],
})
export class SensConfigModule {}
