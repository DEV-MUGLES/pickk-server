import { BaseStep } from '../jobs/base.step';
import { JobExecutionContext } from '../models';

export interface IJobExecution {
  steps: BaseStep[];
  jobName: string;
  context: JobExecutionContext;
  errorHandler?: (err: Error) => void | Promise<void>;
  isSavingContext: boolean;
}
