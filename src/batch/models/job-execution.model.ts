import { BaseStep } from '../base.step';
import { IJobExecution } from '../interfaces';

import { JobExecutionContext } from '.';

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
