import { Logger, Module } from '@nestjs/common';

import { MysqlDatabaseProviderModule } from '@providers/database/mysql/provider.module';

import { ItemCategorySeeder } from './item-category.seeder';
import { SeederService } from './seeder.service';

@Module({
  imports: [MysqlDatabaseProviderModule],
  providers: [Logger, SeederService, ItemCategorySeeder],
})
export class SeederModule {}
