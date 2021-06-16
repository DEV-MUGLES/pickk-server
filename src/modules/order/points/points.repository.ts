import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';

import { ExpectedPointEventEntity, PointEventEntity } from './entities';
import { ExpectedPointEvent, PointEvent } from './models';

@EntityRepository(PointEventEntity)
export class PointEventsRepository extends BaseRepository<
  PointEventEntity,
  PointEvent
> {
  entityToModel(entity: PointEventEntity, transformOptions = {}): PointEvent {
    return plainToClass(PointEvent, entity, transformOptions) as PointEvent;
  }

  entityToModelMany(
    entities: PointEventEntity[],
    transformOptions = {}
  ): PointEvent[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async getSum(userId: number): Promise<number> {
    const { sum } = await this.createQueryBuilder('pointEvent')
      .select('SUM(pointEvent.amount)', 'sum')
      .where('pointEvent.userId = :userId', { userId })
      .getRawOne();
    return sum ?? 0;
  }
}

@EntityRepository(ExpectedPointEventEntity)
export class ExpectedPointEventsRepository extends BaseRepository<
  ExpectedPointEventEntity,
  ExpectedPointEvent
> {
  entityToModel(
    entity: ExpectedPointEventEntity,
    transformOptions = {}
  ): ExpectedPointEvent {
    return plainToClass(
      ExpectedPointEvent,
      entity,
      transformOptions
    ) as ExpectedPointEvent;
  }

  entityToModelMany(
    entities: ExpectedPointEventEntity[],
    transformOptions = {}
  ): ExpectedPointEvent[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async getSum(userId: number): Promise<number> {
    const { sum } = await this.createQueryBuilder('expectedPointEvent')
      .select('SUM(expectedPointEvent.amount)', 'sum')
      .where('expectedPointEvent.userId = :userId', { userId })
      .getRawOne();
    return sum ?? 0;
  }
}
