import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemPropertiesRepository } from '@item/item-properties/item-properties.repository';
import { MysqlDatabaseProviderModule } from '@providers/database/mysql/provider.module';

import { ItemCategorySeeder } from './item-category.seeder';
import { ItemPropertySeeder } from './item-property.seeder';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    MysqlDatabaseProviderModule,
    TypeOrmModule.forFeature([ItemPropertiesRepository]),
  ],
  providers: [Logger, SeederService, ItemCategorySeeder, ItemPropertySeeder],
})
export class SeederModule {}
