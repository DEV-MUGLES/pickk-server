import { Module } from '@nestjs/common';
import { SqsModule, SqsConfig } from '@pickk/nest-sqs';

import { AwsSqsConfigModule } from '@config/providers/aws/sqs/config.module';
import { AwsSqsConfigService } from '@config/providers/aws/sqs/config.service';

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
