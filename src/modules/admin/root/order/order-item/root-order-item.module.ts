import { Module } from '@nestjs/common';

import { OrderItemsModule } from '@order/order-items/order-items.module';

import { RootOrderItemResolver } from './root-order-item.resolver';

@Module({
  imports: [OrderItemsModule],
  providers: [RootOrderItemResolver],
})
export class RootOrderItemModule {}
