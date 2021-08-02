import { JobExecutionContext } from '../job-execution.context';

export interface IRead<T = unknown> {
  (context: JobExecutionContext): T | Promise<T>;
}
