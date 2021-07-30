import { JobExecutionContext } from '../job-execution.context';

import { IStep } from './step.interface';

export interface IJobExecution {
  steps: IStep[];
  jobName: string;
  context: JobExecutionContext;
  errorHandler?: (err: Error) => void | Promise<void>;
  _saveContext: boolean;
}
