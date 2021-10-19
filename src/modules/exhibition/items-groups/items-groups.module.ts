import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ItemsGroupItemsRepository,
  ItemsGroupsRepository,
} from './items-groups.repository';
import { ItemsGroupsResolver } from './items-groups.resolver';
import { ItemsGroupsService } from './items-groups.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemsGroupsRepository,
      ItemsGroupItemsRepository,
    ]),
  ],
  providers: [ItemsGroupsResolver, ItemsGroupsService],
  exports: [ItemsGroupsService],
})
export class ItemsGroupsModule {}
