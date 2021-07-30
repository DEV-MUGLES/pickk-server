import { JobExecutionContext } from '../job-execution.context';

export interface ITasklet {
  (context: JobExecutionContext): void | Promise<void>;
}
