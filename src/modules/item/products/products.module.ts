import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE } from '@queue/constants';

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
  ],
  providers: [
    ProductsResolver,
    ProductsService,
    RestoreDeductedProductStockConsumer,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
