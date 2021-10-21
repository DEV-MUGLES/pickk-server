import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import {
  INDEX_REFUND_REQUEST_QUEUE,
  PROCESS_VBANK_PAID_ORDER_QUEUE,
  RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE,
  SAVE_BUYER_INFO_QUEUE,
  SEND_CANCEL_ORDER_APPROVED_ALIMTALK_QUEUE,
  SEND_ORDER_COMPLETED_ALIMTALK_QUEUE,
  SEND_REFUND_REQUESTED_ALIMTALK_QUEUE,
  SEND_VBANK_PAID_ALIMTALK_QUEUE,
} from '@queue/constants';

import { DigestsModule } from '@content/digests/digests.module';
import { CartsModule } from '@item/carts/carts.module';
import { ProductsModule } from '@item/products/products.module';
import { CouponsModule } from '@order/coupons/coupons.module';
import { OrderItemsModule } from '@order/order-items/order-items.module';
import { PointsModule } from '@order/points/points.module';
import { PaymentsModule } from '@payment/payments/payments.module';
import { UsersModule } from '@user/users/users.module';
import { RefundRequestsModule } from '@order/refund-requests/refund-requests.module';

import { OrdersConsumers } from './consumers';
import { OrdersProducer } from './producers';

import { OrdersCreateResolver } from './orders-create.resolver';
import { OrdersProcessResolver } from './orders-process.resolver';
import { OrdersResolver } from './orders.resolver';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersRepository]),
    DigestsModule,
    CartsModule,
    ProductsModule,
    CouponsModule,
    PointsModule,
    PaymentsModule,
    forwardRef(() => UsersModule),
    forwardRef(() => OrderItemsModule),
    forwardRef(() => RefundRequestsModule),
    SqsModule.registerQueue(
      {
        name: RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE,
        type: SqsQueueType.Producer,
      },
      {
        name: SEND_CANCEL_ORDER_APPROVED_ALIMTALK_QUEUE,
      },
      {
        name: PROCESS_VBANK_PAID_ORDER_QUEUE,
        type: SqsQueueType.Consumer,
      },
      {
        name: SEND_VBANK_PAID_ALIMTALK_QUEUE,
        type: SqsQueueType.Consumer,
      },
      {
        name: SEND_ORDER_COMPLETED_ALIMTALK_QUEUE,
      },
      {
        name: SEND_REFUND_REQUESTED_ALIMTALK_QUEUE,
      },
      {
        name: SAVE_BUYER_INFO_QUEUE,
        type: SqsQueueType.Producer,
      },
      {
        name: INDEX_REFUND_REQUEST_QUEUE,
        type: SqsQueueType.Producer,
      }
    ),
  ],
  providers: [
    Logger,
    OrdersCreateResolver,
    OrdersProcessResolver,
    OrdersResolver,
    OrdersService,
    OrdersProducer,
    ...OrdersConsumers,
  ],
  exports: [OrdersService, OrdersProducer],
})
export class OrdersModule {}
