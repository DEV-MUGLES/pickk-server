import { PickType } from '@nestjs/mapped-types';

import { JobExecutionRecord } from '../models';

export class CreateJobExecutionRecordDto extends PickType(JobExecutionRecord, [
  'jobName',
]) {}
