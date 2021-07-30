import { BaseRepository } from '@common/base.repository';
import { plainToClass } from 'class-transformer';
import { EntityRepository } from 'typeorm';

import { JobExecutionRecordEntity } from './entities/job-execution-record.entity';

import { JobExecutionRecord } from './models';

@EntityRepository(JobExecutionRecordEntity)
export class JobExecutionRecordRepository extends BaseRepository<
  JobExecutionRecordEntity,
  JobExecutionRecord
> {
  entityToModel(
    entity: JobExecutionRecordEntity,
    transformOptions = {}
  ): JobExecutionRecord {
    return plainToClass(
      JobExecutionRecord,
      entity,
      transformOptions
    ) as JobExecutionRecord;
  }

  entityToModelMany(
    entities: JobExecutionRecordEntity[],
    transformOptions = {}
  ): JobExecutionRecord[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
