import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@nestjs-packages/sqs';

import {
  DELETE_ORDER_ITEMS_INDEX_QUEUE,
  GIVE_REWARD_QUEUE,
  INDEX_ORDER_ITEMS_QUEUE,
} from '@queue/constants';

import { SearchModule } from '@mcommon/search/search.module';

import { OrderItemsProducer } from './producers';

import { OrderItemsProcessResolver } from './order-items.process.resolver';
import { OrderItemsRepository } from './order-items.repository';
import { OrderItemsService } from './order-items.service';
import {
  DeleteOrderItemsIndexConsumer,
  IndexOrderItemsConsumer,
} from './consumers';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItemsRepository]),
    SqsModule.registerQueue(
      {
        name: GIVE_REWARD_QUEUE,
        type: SqsQueueType.Producer,
      },
      {
        name: INDEX_ORDER_ITEMS_QUEUE,
        consumerOptions: { batchSize: 10 },
      },
      {
        name: DELETE_ORDER_ITEMS_INDEX_QUEUE,
        consumerOptions: { batchSize: 10 },
      }
    ),
    forwardRef(() => SearchModule),
  ],
  providers: [
    OrderItemsProcessResolver,
    OrderItemsService,
    OrderItemsProducer,
    IndexOrderItemsConsumer,
    DeleteOrderItemsIndexConsumer,
  ],
  exports: [OrderItemsProducer, OrderItemsService],
})
export class OrderItemsModule {}
