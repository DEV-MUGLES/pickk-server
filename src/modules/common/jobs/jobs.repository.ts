import { BaseRepository } from '@common/base.repository';
import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';

import {
  JobEntity,
  StepExecutionRecordEntity,
  JobExecutionRecordEntity,
} from './entities';
import { Job, JobExecutionRecord, StepExecutionRecord } from './models';

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

@EntityRepository(StepExecutionRecordEntity)
export class StepExecutionRecordRepository extends BaseRepository<
  StepExecutionRecordEntity,
  StepExecutionRecord
> {
  entityToModel(
    entity: StepExecutionRecordEntity,
    transformOptions = {}
  ): StepExecutionRecord {
    return plainToClass(
      StepExecutionRecord,
      entity,
      transformOptions
    ) as StepExecutionRecord;
  }

  entityToModelMany(
    entities: StepExecutionRecordEntity[],
    transformOptions = {}
  ): StepExecutionRecord[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}

@EntityRepository(JobEntity)
export class JobRepository extends Repository<JobEntity> {
  entityToModel(entity: JobEntity, transformOptions = {}): Job {
    return plainToClass(Job, entity, transformOptions) as Job;
  }

  entityToModelMany(entities: JobEntity[], transformOptions = {}): Job[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
