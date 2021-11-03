import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ItemsExhibitionsRepository,
  ItemsExhibitionItemsRepository,
} from './items-exhibitions.repository';
import { ItemsExhibitionsResolver } from './items-exhibitions.resolver';
import { ItemsExhibitionsService } from './items-exhibitions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemsExhibitionsRepository,
      ItemsExhibitionItemsRepository,
    ]),
  ],
  providers: [ItemsExhibitionsResolver, ItemsExhibitionsService],
  exports: [ItemsExhibitionsService],
})
export class ItemsExhibitionsModule {}
