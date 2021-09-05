import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ItemsExhibitionsRepository,
  ItemsExhibitionItemsRepository,
} from './items-exhibitions.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemsExhibitionsRepository,
      ItemsExhibitionItemsRepository,
    ]),
  ],
})
export class ItemsExhibitionsModule {}
