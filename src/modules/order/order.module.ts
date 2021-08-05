import { Module } from '@nestjs/common';

import { CouponsModule } from './coupons/coupons.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { OrdersModule } from './orders/orders.module';
import { PointsModule } from './points/points.module';
import { RefundRequestsModule } from './refund-requests/refund-requests.module';

@Module({
  imports: [
    CouponsModule,
    OrderItemsModule,
    OrdersModule,
    PointsModule,
    RefundRequestsModule,
  ],
})
export class OrderModule {}
