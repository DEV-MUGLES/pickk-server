import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import configuration from './configuration';
import { AwsS3ConfigService } from './config.service';

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
        AWS_S3_REGION: Joi.string().default('ap-northeast-2'),
        AWS_S3_ACCESS_KEY_ID: Joi.string().default('AKIA5BVP35V2AID3OAPH'),
        AWS_S3_SECRET_ACCESS_KEY: Joi.string().default(
          '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'
        ),
        AWS_S3_PUBLIC_BUCKET_NAME: Joi.string().default(
          'pickk-server-images-bucket'
        ),
        AWS_CLOUDFRONT_URL: Joi.string().default(
          'https://d30jbgl6dfbres.cloudfront.net/'
        ),
      }),
    }),
  ],
  providers: [ConfigService, AwsS3ConfigService],
  exports: [ConfigService, AwsS3ConfigService],
})
export class AwsS3ConfigModule {}
