import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BullModule, SharedBullAsyncConfiguration } from '@nestjs/bull';
import { router } from 'bull-board';

import { RedisConfigModule } from '@config/cache/redis/config.module';
import { RedisConfigService } from '@config/cache/redis/config.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [RedisConfigModule],
      useFactory: async (redisConfigService: RedisConfigService) => ({
        redis: {
          host: redisConfigService.host,
          port: redisConfigService.port,
          connectTimeout: 10000,
        },
      }),
      inject: [RedisConfigService],
    } as SharedBullAsyncConfiguration),
  ],
})
export class BullProviderModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(router).forRoutes('/queue');
  }
}
