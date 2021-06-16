import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PointEventsRepository } from './points.repository';
import { PointsResolver } from './points.resolver';
import { PointsService } from './points.service';

@Module({
  imports: [TypeOrmModule.forFeature([PointEventsRepository])],
  providers: [PointsResolver, PointsService],
})
export class PointsModule {}
