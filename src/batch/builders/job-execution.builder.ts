import { IJobExecution } from '../interfaces';
import { BaseStep } from '../jobs/base.step';
import { JobExecution, JobExecutionContext } from '../models';

export class JobExecutionBuilder implements IJobExecution {
  steps: BaseStep[] = [];
  jobName: string;
  context: JobExecutionContext = new JobExecutionContext();
  errorHandler: (err: Error) => void | Promise<void>;
  isSavingContext = false;

  public get(jobName: string) {
    this.jobName = jobName;
    return this;
  }

  public start(step: BaseStep) {
    if (this.steps.length !== 0) {
      throw new Error('start must call for first step');
    }
    this.steps = [step];
    return this;
  }

  public next(step: BaseStep) {
    if (this.steps.length < 1) {
      throw new Error('next is not for first step');
    }
    this.steps.push(step);
    return this;
  }

  public saveContext() {
    this.isSavingContext = true;
    return this;
  }

  public addErrorHandler(handleError: (err: Error) => void | Promise<void>) {
    this.errorHandler = handleError;
    return this;
  }

  public build() {
    return new JobExecution(this);
  }
}
