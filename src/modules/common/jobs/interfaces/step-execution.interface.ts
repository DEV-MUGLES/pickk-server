import { IBaseId } from '@common/interfaces';

import { IJobExecutionRecord } from './job-execution-record.interface';

export interface IStepExecutionRecord extends IBaseId {
  jobExecutionRecord: IJobExecutionRecord;
  jobExecutionRecordId?: number;

  stepName: string;
  status: string;
  startedAt: Date;
  endAt: Date;

  errorMessage: string;
}
