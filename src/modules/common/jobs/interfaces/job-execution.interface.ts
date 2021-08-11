import { Job } from '../models';

import { IJobExecutionContextRecord } from './job-execution-context.interface';
import { IStepExecutionRecord } from './step-execution.interface';

export interface IJobExecutionRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date;
  endAt: Date;
  status: string;
  errorMessage: string;

  jobName: string;
  job?: Job;
  contextRecordId?: number;
  contextRecord?: IJobExecutionContextRecord;
  stepExecutionRecords?: IStepExecutionRecord[];
}
