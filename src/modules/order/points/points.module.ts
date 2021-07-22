import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@pickk/nestjs-sqs';

import { REMOVE_EXPECTED_POINT_EVENT_QUEUE } from './constants';
import { Consumers } from './consumers';
import { Producers } from './producers';
import {
  ExpectedPointEventsRepository,
  PointEventsRepository,
} from './points.repository';
import { PointsResolver } from './points.resolver';
import { PointsService } from './points.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExpectedPointEventsRepository,
      PointEventsRepository,
    ]),
    SqsModule.registerQueue({
      name: REMOVE_EXPECTED_POINT_EVENT_QUEUE,
    }),
  ],
  providers: [PointsResolver, PointsService, ...Consumers, ...Producers],
  exports: [PointsService],
})
export class PointsModule {}
