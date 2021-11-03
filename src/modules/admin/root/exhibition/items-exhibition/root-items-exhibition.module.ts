import { Module } from '@nestjs/common';

import { ItemsExhibitionsModule } from '@exhibition/items-exhibitions/items-exhibitions.module';
import { RootItemsExhibitionResolver } from './root-items-exhibition.resolver';

@Module({
  imports: [ItemsExhibitionsModule],
  providers: [RootItemsExhibitionResolver],
})
export class RootItemsExhibitionModule {}
