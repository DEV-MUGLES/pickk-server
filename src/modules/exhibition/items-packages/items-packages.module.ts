import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ItemsPackagesRepository,
  ItemsPackageItemsRepository,
} from './items-packages.repository';
import { ItemsPackagesResolver } from './items-packages.resolver';
import { ItemsPackagesService } from './items-packages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemsPackagesRepository,
      ItemsPackageItemsRepository,
    ]),
  ],
  providers: [ItemsPackagesResolver, ItemsPackagesService],
})
export class ItemsPackagesModule {}
