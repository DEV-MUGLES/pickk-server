import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsGroupsRepository } from './items-groups.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ItemsGroupsRepository])],
})
export class ItemsGroupsModule {}
