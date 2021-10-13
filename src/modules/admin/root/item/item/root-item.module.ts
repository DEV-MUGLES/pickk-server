import { Module } from '@nestjs/common';

import { ItemsModule } from '@item/items/items.module';

import { RootItemResolver } from './root-item.resolver';

@Module({
  imports: [ItemsModule],
  providers: [RootItemResolver],
})
export class RootItemModule {}
