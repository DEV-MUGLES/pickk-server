import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE } from '@queue/constants';

import { ItemsModule } from '@item/items/items.module';
import { OrderItemsModule } from '@order/order-items/order-items.module';

import { RestoreDeductedProductStockConsumer } from './consumers';

import { ProductsRepository } from './products.repository';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductsRepository]),
    SqsModule.registerQueue({
      name: RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE,
      type: SqsQueueType.Consumer,
    }),
    forwardRef(() => ItemsModule),
    forwardRef(() => OrderItemsModule),
  ],
  providers: [
    ProductsResolver,
    ProductsService,
    RestoreDeductedProductStockConsumer,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
