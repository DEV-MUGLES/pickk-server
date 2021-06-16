import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
  providers: [PointsResolver, PointsService],
  exports: [PointsService],
})
export class PointsModule {}
