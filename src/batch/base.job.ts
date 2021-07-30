import { JobExecution } from './job.execution';

export abstract class BaseJob {
  abstract createExecution(): JobExecution;
}
