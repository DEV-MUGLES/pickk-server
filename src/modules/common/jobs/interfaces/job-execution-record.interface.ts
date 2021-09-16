import { IBaseId } from '@common/interfaces';

import { IJobExecutionContextRecord } from './job-execution-context.interface';
import { IJob } from './job.interface';
import { IStepExecutionRecord } from './step-execution.interface';

export interface IJobExecutionRecord extends IBaseId {
  job: IJob;
  jobName: string;
  contextRecord: IJobExecutionContextRecord;
  contextRecordId: number;

  stepExecutionRecords: IStepExecutionRecord[];

  startedAt: Date;
  endAt: Date;
  status: string;
  errorMessage: string;
}
