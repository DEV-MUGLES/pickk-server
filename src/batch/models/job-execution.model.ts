import { IJobExecution } from '../interfaces';
import { BaseStep } from '../jobs/base.step';

import { JobExecutionContext } from './job-execution-context.model';

export class JobExecution implements IJobExecution {
  steps: BaseStep[];
  jobName: string;
  context: JobExecutionContext;
  errorHandler: (err: Error) => void | Promise<void>;
  isSavingContext: boolean;

  constructor(attributes?: Partial<JobExecution>) {
    this.steps = attributes.steps;
    this.jobName = attributes.jobName;
    this.context = attributes.context;
    this.errorHandler = attributes.errorHandler;
    this.isSavingContext = attributes.isSavingContext;
  }
}
