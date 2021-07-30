import { IJobExecution, IStep } from './interfaces';
import { JobExecutionContext } from './job-execution.context';

export class JobExecution implements IJobExecution {
  steps: IStep[];
  jobName: string;
  context: JobExecutionContext;
  errorHandler: (err: Error) => void | Promise<void>;
  _saveContext: boolean;

  constructor(attributes?: Partial<JobExecution>) {
    this.steps = attributes.steps;
    this.jobName = attributes.jobName;
    this.context = attributes.context;
    this.errorHandler = attributes.errorHandler;
    this._saveContext = attributes._saveContext;
  }
}
