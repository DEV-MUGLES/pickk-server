import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExchangeRequestsModule } from '@order/exchange-requests/exchange-requests.module';
import { OrderItemsModule } from '@order/order-items/order-items.module';
import { OrdersModule } from '@order/orders/orders.module';
import { PointsModule } from '@order/points/points.module';
import { PaymentsModule } from '@payment/payments/payments.module';

import { RefundRequestsRepository } from './refund-requests.repository';
import { RefundRequestsService } from './refund-requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefundRequestsRepository]),
    forwardRef(() => OrdersModule),
    forwardRef(() => OrderItemsModule),
    PaymentsModule,
    PointsModule,
    forwardRef(() => ExchangeRequestsModule),
  ],
  providers: [RefundRequestsService],
  exports: [RefundRequestsService],
})
export class RefundRequestsModule {}
