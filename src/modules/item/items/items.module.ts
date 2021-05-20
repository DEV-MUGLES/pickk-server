import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';
import { ItemsRepository } from './repositories/items.repository';
import { ItemSizeChartsRepository } from './repositories/item-size-charts.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemsRepository, ItemSizeChartsRepository]),
  ],
  providers: [ItemsResolver, ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
