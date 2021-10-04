import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { AwsS3ProviderModule } from '@providers/aws/s3';
import {
  SAVE_BUYER_INFO_QUEUE,
  UPDATE_USER_FOLLOW_COUNT_QUEUE,
} from '@queue/constants';

import { OrderItemsModule } from '@order/order-items/order-items.module';
import { PointsModule } from '@order/points/points.module';
import { FollowsModule } from '@user/follows/follows.module';

import {
  SaveBuyerInfoConsumer,
  UpdateUserFollowCountConsumer,
} from './consumers';

import { UsersService } from './users.service';
import {
  RefundAccountsRepository,
  ShippingAddressesRepository,
  UsersRepository,
} from './users.repository';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersRepository,
      ShippingAddressesRepository,
      RefundAccountsRepository,
    ]),
    SqsModule.registerQueue(
      {
        name: UPDATE_USER_FOLLOW_COUNT_QUEUE,
        type: SqsQueueType.Consumer,
        consumerOptions: { batchSize: 10 },
      },
      {
        name: SAVE_BUYER_INFO_QUEUE,
        type: SqsQueueType.Consumer,
      }
    ),
    AwsS3ProviderModule,
    PointsModule,
    FollowsModule,
    OrderItemsModule,
  ],
  providers: [
    Logger,
    UsersService,
    UsersResolver,
    SaveBuyerInfoConsumer,
    UpdateUserFollowCountConsumer,
  ],
  exports: [UsersService],
})
export class UsersModule {}
