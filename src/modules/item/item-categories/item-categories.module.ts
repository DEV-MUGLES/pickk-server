import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemCategoriesRepository } from './item-categories.repository';
import { ItemCategoriesResolver } from './item-categories.resolver';
import { ItemCategoriesService } from './item-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemCategoriesRepository])],
  providers: [ItemCategoriesResolver, ItemCategoriesService],
})
export class ItemCategoriesModule {}
