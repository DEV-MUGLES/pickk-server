import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemPropertiesRepository } from './item-properties.repository';
import { ItemPropertiesResolver } from './item-properties.resolver';
import { ItemPropertiesService } from './item-properties.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemPropertiesRepository])],
  providers: [ItemPropertiesResolver, ItemPropertiesService],
})
export class ItemPropertiesModule {}
