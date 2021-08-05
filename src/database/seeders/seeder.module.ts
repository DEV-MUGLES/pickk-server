import { Logger, Module } from '@nestjs/common';

import { MysqlDatabaseProviderModule } from '@providers/database/mysql/provider.module';

import { AppSeeder } from './app.seeder';
import { ItemCategorySeeder } from './item-category.seeder';

@Module({
  imports: [MysqlDatabaseProviderModule],
  providers: [AppSeeder, Logger, ItemCategorySeeder],
})
export class SeederModule {}
