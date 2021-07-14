import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { AwsSqsConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        AWS_SQS_REGION: Joi.string().default('ap-northeast-2'),
        AWS_SQS_ACCESS_KEY_ID: Joi.string().default('temp'),
        AWS_SQS_SECRET_ACCESS_KEY: Joi.string().default('temp'),
        AWS_SQS_END_POINT: Joi.string().default('http://localhost:4566/'),
        AWS_SQS_ACCOUNT_NUMBER: Joi.string().default('000000000000'),
      }),
    }),
  ],
  providers: [ConfigService, AwsSqsConfigService],
  exports: [ConfigService, AwsSqsConfigService],
})
export class AwsSqsConfigModule {}
