import { Job } from '../models';

import { IStepExecutionRecord, IJobExecutionContextRecord } from '.';

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
