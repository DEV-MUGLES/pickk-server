import { JobExecutionContext } from '../job-execution.context';

export interface IProcess<T = unknown, S = unknown> {
  (readResult: T, context: JobExecutionContext): Promise<S>;
}
