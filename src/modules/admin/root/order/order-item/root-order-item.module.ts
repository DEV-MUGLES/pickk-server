import { Module } from '@nestjs/common';

import { SearchModule } from '@mcommon/search/search.module';
import { OrderItemsModule } from '@order/order-items/order-items.module';

import { RootOrderItemResolver } from './root-order-item.resolver';

@Module({
  imports: [OrderItemsModule, SearchModule],
  providers: [RootOrderItemResolver],
})
export class RootOrderItemModule {}
