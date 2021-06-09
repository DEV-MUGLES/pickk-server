import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BullModule, SharedBullAsyncConfiguration } from '@nestjs/bull';
import { router } from 'bull-board';

import { BullConfigModule } from '@config/providers/bull/config.module';
import { BullConfigService } from '@config/providers/bull/config.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [BullConfigModule],
      useFactory: async (bullConfigService: BullConfigService) => ({
        redis: {
          host: bullConfigService.redisHost,
          port: bullConfigService.redisPort,
          connectTimeout: 10000,
        },
      }),
      inject: [BullConfigService],
    } as SharedBullAsyncConfiguration),
  ],
})
export class BullProviderModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(router).forRoutes('/queue');
  }
}
