import { EntityManager } from 'typeorm';
import { JobExecutionContext } from '../job-execution.context';

export interface IWrite<T = unknown> {
  (
    readerResult: T,
    transactionalEntityManager: EntityManager,
    context: JobExecutionContext
  ): Promise<void>;
}
