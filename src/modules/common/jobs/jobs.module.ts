import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  JobExecutionRecordRepository,
  JobRepository,
  StepExecutionRecordRepository,
} from './jobs.repository';
import { JobsService } from './jobs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobExecutionRecordRepository,
      StepExecutionRecordRepository,
      JobRepository,
    ]),
  ],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
