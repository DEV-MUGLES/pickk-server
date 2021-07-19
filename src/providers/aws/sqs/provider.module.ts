import { Module } from '@nestjs/common';
import { SqsModule, SqsConfig } from '@pickk/nest-sqs';

import {
  AwsSqsConfigModule,
  AwsSqsConfigService,
} from '@config/providers/aws/sqs';

@Module({
  imports: [
    SqsModule.forRootAsync({
      imports: [AwsSqsConfigModule],
      useFactory: (awsSqsConfigService: AwsSqsConfigService) => {
        const {
          endpoint,
          region,
          accessKeyId,
          secretAccessKey,
          accountNumber,
        } = awsSqsConfigService;
        return new SqsConfig({
          endpoint,
          region,
          accountNumber,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });
      },
      inject: [AwsSqsConfigService],
    }),
  ],
})
export class AwsSqsProviderModule {}
