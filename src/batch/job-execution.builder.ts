import { IJobExecution, IStep } from './interfaces';
import { JobExecutionContext } from './job-execution.context';
import { JobExecution } from './job.execution';

export class JobExecutionBuilder implements IJobExecution {
  steps: IStep[] = [];
  jobName: string;
  context: JobExecutionContext = new JobExecutionContext();
  errorHandler: (err: Error) => void | Promise<void>;
  _saveContext = false;

  public get(jobName: string) {
    this.jobName = jobName;
    return this;
  }

  public start(step: IStep) {
    if (this.steps.length !== 0) {
      throw new Error('start must call for first step');
    }
    this.steps = [step];
    return this;
  }

  public next(step: IStep) {
    if (this.steps.length < 1) {
      throw new Error('next is not for first step');
    }
    this.steps.push(step);
    return this;
  }

  public saveContext() {
    this._saveContext = true;
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
