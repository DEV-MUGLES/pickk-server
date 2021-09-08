import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ItemPropertiesRepository,
  ItemPropertyValuesRepository,
} from './item-properties.repository';
import { ItemPropertiesResolver } from './item-properties.resolver';
import { ItemPropertiesService } from './item-properties.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemPropertiesRepository,
      ItemPropertyValuesRepository,
    ]),
  ],
  providers: [ItemPropertiesResolver, ItemPropertiesService],
  exports: [ItemPropertiesService],
})
export class ItemPropertiesModule {}
