import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { PointsModule } from '@order/points/points.module';
import { AwsS3ProviderModule } from '@providers/aws/s3';
import { UPDATE_USER_FOLLOW_COUNT_QUEUE } from '@queue/constants';
import { FollowsModule } from '@user/follows/follows.module';

import { UpdateUserFollowCountConsumer } from './consumers';

import { UsersService } from './users.service';
import {
  ShippingAddressesRepository,
  UsersRepository,
} from './users.repository';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository, ShippingAddressesRepository]),
    SqsModule.registerQueue({
      name: UPDATE_USER_FOLLOW_COUNT_QUEUE,
      type: SqsQueueType.Consumer,
      consumerOptions: { batchSize: 10 },
    }),
    AwsS3ProviderModule,
    PointsModule,
    FollowsModule,
  ],
  providers: [UsersService, UsersResolver, UpdateUserFollowCountConsumer],
  exports: [UsersService],
})
export class UsersModule {}
