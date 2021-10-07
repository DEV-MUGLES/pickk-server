import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { GIVE_REWARD_QUEUE } from '@queue/constants';

import { OrderItemsProducer } from './producers';

import { OrderItemsProcessResolver } from './order-items.process.resolver';
import { OrderItemsRepository } from './order-items.repository';
import { OrderItemsService } from './order-items.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItemsRepository]),
    SqsModule.registerQueue({
      name: GIVE_REWARD_QUEUE,
      type: SqsQueueType.Producer,
    }),
  ],
  providers: [OrderItemsProcessResolver, OrderItemsService, OrderItemsProducer],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
