import { Module } from '@nestjs/common';

import { DigestsExhibitionsModule } from './digests-exhibitions/digests-exhibitions.module';
import { ItemsExhibitionsModule } from './items-exhibitions/items-exhibitions.module';
import { ItemsPackagesModule } from './items-packages/items-packages.module';

@Module({
  imports: [
    DigestsExhibitionsModule,
    ItemsExhibitionsModule,
    ItemsPackagesModule,
  ],
})
export class ExhibitionModule {}
