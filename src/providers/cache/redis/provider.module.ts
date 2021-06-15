import * as redisStore from 'cache-manager-redis-store';
import {
  Global,
  Module,
  CacheModule,
  CacheModuleAsyncOptions,
  CacheModuleOptions,
} from '@nestjs/common';

import { RedisConfigModule } from '@config/cache/redis/config.module';
import { RedisConfigService } from '@config/cache/redis/config.service';

import { CacheService } from './provider.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [RedisConfigModule],
      useFactory: async (redisConfigService: RedisConfigService) =>
        ({
          store: redisStore,
          host: redisConfigService.host,
          port: redisConfigService.port,
          ttl: 3600,
        } as CacheModuleOptions),
      inject: [RedisConfigService],
    } as CacheModuleAsyncOptions),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class RedisCacheProviderModule {}
