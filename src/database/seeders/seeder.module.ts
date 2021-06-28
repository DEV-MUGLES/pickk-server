import { Logger, Module } from '@nestjs/common';

import { Seeder } from './seeder';
import { ItemSeederModule } from './item/item-seeder.module';
import { UsersSeederModule } from './user/user-seeder.module';
import { RedisCacheProviderModule } from '@providers/cache/redis/provider.module';
import { MysqlDatabaseProviderModule } from '@providers/database/mysql/provider.module';

@Module({
  imports: [
    MysqlDatabaseProviderModule,
    ItemSeederModule,
    UsersSeederModule,
    RedisCacheProviderModule,
  ],
  providers: [Seeder, Logger],
})
export class SeederModule {}
