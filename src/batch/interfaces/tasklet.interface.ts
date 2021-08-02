import { EntityManager } from 'typeorm';
import { JobExecutionContext } from '../job-execution.context';

export interface ITasklet {
  (
    transactionalEntityManager: EntityManager,
    context: JobExecutionContext
  ): Promise<void>;
}
