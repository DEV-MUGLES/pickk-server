import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@nestjs-packages/sqs';

import { GIVE_REWARD_QUEUE } from '@queue/constants';

import { OrderItemsModule } from '@order/order-items/order-items.module';

import { GiveRewardConsumer } from './consumers';

import { RewardEventsRepository } from './rewards.repository';
import { RewardsService } from './rewards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RewardEventsRepository]),
    OrderItemsModule,
    SqsModule.registerQueue({
      name: GIVE_REWARD_QUEUE,
      type: SqsQueueType.Consumer,
    }),
  ],
  providers: [RewardsService, GiveRewardConsumer],
})
export class RewardsModule {}
