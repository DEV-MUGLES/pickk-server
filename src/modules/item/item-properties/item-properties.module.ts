import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemPropertiesRepository } from './item-properties.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ItemPropertiesRepository])],
})
export class ItemPropertiesModule {}
