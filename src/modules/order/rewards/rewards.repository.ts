import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { RewardEventEntity } from './entities';
import { RewardEvent } from './models';

@EntityRepository(RewardEventEntity)
export class RewardEventsRepository extends BaseRepository<
  RewardEventEntity,
  RewardEvent
> {
  entityToModel(entity: RewardEventEntity, transformOptions = {}): RewardEvent {
    return plainToClass(RewardEvent, entity, transformOptions) as RewardEvent;
  }

  entityToModelMany(
    entities: RewardEventEntity[],
    transformOptions = {}
  ): RewardEvent[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async getSum(userId: number): Promise<number> {
    const { sum } = await this.createQueryBuilder('rewardEvent')
      .select('SUM(rewardEvent.amount)', 'sum')
      .where('rewardEvent.userId = :userId', { userId })
      .getRawOne();
    return sum ?? 0;
  }
}
