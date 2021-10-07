import { Module } from '@nestjs/common';

import { CouponsModule } from './coupons/coupons.module';
import { ExchangeRequestsModule } from './exchange-requests/exchange-requests.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { OrdersModule } from './orders/orders.module';
import { PointsModule } from './points/points.module';
import { RefundRequestsModule } from './refund-requests/refund-requests.module';
import { RewardsModule } from './rewards/rewards.module';
import { ShipmentsModule } from './shipments/shipments.module';

@Module({
  imports: [
    CouponsModule,
    ExchangeRequestsModule,
    OrderItemsModule,
    OrdersModule,
    PointsModule,
    RefundRequestsModule,
    RewardsModule,
    ShipmentsModule,
  ],
})
export class OrderModule {}
