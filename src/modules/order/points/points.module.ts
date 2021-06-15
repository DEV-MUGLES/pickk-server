import { Module } from '@nestjs/common';

import { PointsService } from './points.service';

@Module({
  providers: [PointsService],
})
export class PointsModule {}
