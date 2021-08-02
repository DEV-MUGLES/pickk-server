import { EntityManager } from 'typeorm';
import { JobExecutionContext } from '../job-execution.context';

export interface IWrite<T = unknown> {
  (
    result: T,
    transactionalEntityManager: EntityManager,
    context: JobExecutionContext
  ): Promise<void>;
}
