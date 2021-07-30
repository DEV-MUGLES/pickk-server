import { IStepExecutionRecord, IJobExecutionContextRecord } from '.';
import { Job } from '../models';

export interface IJobExecutionRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  startAt: Date;
  endAt: Date;
  status: string;
  exitMessage: string;

  jobName: string;
  job?: Job;
  contextRecordId?: number;
  contextRecord?: IJobExecutionContextRecord;
  stepExecutionRecords?: IStepExecutionRecord[];
}
