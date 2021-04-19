import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemCategoriesRepository } from './item-categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ItemCategoriesRepository])],
})
export class ItemCategoriesModule {}
