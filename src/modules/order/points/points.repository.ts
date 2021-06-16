import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';

import { PointEventEntity } from './entities/point-event.entity';
import { PointEvent } from './models/point-event.model';

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
