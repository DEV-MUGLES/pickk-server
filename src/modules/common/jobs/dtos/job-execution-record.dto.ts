import { IStep } from '@src/batch/interfaces';

export class CreateJobExecutionRecordDto {
  steps: IStep[];
  jobName: string;
}
