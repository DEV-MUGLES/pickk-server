import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

import configuration from './configuration';
import { SlackConfigService } from './config.service';

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
        SLACK_WEBHOOK_URL: Joi.string().default(
          'https://hooks.slack.com/services/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'
        ),
      }),
    }),
  ],
  providers: [ConfigService, SlackConfigService],
  exports: [ConfigService, SlackConfigService],
})
export class SlackConfigModule {}
