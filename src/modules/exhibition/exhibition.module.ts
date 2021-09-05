import { Module } from '@nestjs/common';

import { DigestsExhibitionsModule } from './digests-exhibitions/digests-exhibitions.module';
import { ItemsExhibitionsModule } from './items-exhibitions/items-exhibitions.module';

@Module({
  imports: [DigestsExhibitionsModule, ItemsExhibitionsModule],
})
export class ExhibitionModule {}
