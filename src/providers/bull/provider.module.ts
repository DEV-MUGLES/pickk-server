import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BullModule, SharedBullAsyncConfiguration } from '@nestjs/bull';
import { createBullBoard } from 'bull-board';

import { BullConfigModule } from '@src/config/providers/bull/config.module';
import { BullConfigService } from '@src/config/providers/bull/config.service';

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
    BullModule.registerQueue({
      name: 'brand',
      settings: {
        maxStalledCount: 30,
      },
    }),
  ],
})
export class BullProviderModule {
  configure(consumer: MiddlewareConsumer): void {
    const { router } = createBullBoard([]);
    consumer.apply(router).forRoutes('/queue');
  }
}
