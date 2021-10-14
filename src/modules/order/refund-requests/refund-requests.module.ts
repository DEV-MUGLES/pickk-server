import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItemsModule } from '@order/order-items/order-items.module';
import { OrdersModule } from '@order/orders/orders.module';
import { PaymentsModule } from '@payment/payments/payments.module';

import { RefundRequestsRepository } from './refund-requests.repository';
import { RefundRequestsService } from './refund-requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefundRequestsRepository]),
    forwardRef(() => OrdersModule),
    forwardRef(() => OrderItemsModule),
    PaymentsModule,
  ],
  providers: [RefundRequestsService],
  exports: [RefundRequestsService],
})
export class RefundRequestsModule {}
