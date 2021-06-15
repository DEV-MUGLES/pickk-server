import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PointEventsRepository } from './points.repository';
import { PointsService } from './points.service';

@Module({
  imports: [TypeOrmModule.forFeature([PointEventsRepository])],
  providers: [PointsService],
})
export class PointsModule {}
