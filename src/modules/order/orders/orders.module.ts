import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import {
  PROCESS_VBANK_PAID_ORDER_QUEUE,
  RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE,
  SEND_CANCEL_ORDER_APPROVED_ALIMTALK_QUEUE,
  SEND_ORDER_COMPLETED_ALIMTALK_QUEUE,
  SEND_VBANK_NOTI_ALIMTALK_QUEUE,
  SEND_VBANK_PAID_ALIMTALK_QUEUE,
} from '@queue/constants';

import { CartsModule } from '@item/carts/carts.module';
import { ProductsModule } from '@item/products/products.module';
import { CouponsModule } from '@order/coupons/coupons.module';
import { PointsModule } from '@order/points/points.module';
import { PaymentsModule } from '@payment/payments/payments.module';
import { UsersModule } from '@user/users/users.module';

import { OrdersConsumers } from './consumers';
import { OrdersProducer } from './producers';

import { OrdersCreateResolver } from './orders.create.resolver';
import { OrdersProcessResolver } from './orders.process.resolver';
import { OrdersResolver } from './orders.resolver';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersRepository]),
    CartsModule,
    ProductsModule,
    CouponsModule,
    PointsModule,
    PaymentsModule,
    UsersModule,
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
        name: SEND_VBANK_NOTI_ALIMTALK_QUEUE,
      },
      {
        name: SEND_ORDER_COMPLETED_ALIMTALK_QUEUE,
      }
    ),
  ],
  providers: [
    OrdersCreateResolver,
    OrdersProcessResolver,
    OrdersResolver,
    OrdersService,
    OrdersProducer,
    ...OrdersConsumers,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
