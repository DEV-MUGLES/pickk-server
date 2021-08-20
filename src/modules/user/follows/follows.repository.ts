import { EntityRepository, In, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { FollowEntity } from './entities';
import { Follow } from './models';

@EntityRepository(FollowEntity)
export class FollowsRepository extends Repository<FollowEntity> {
  entityToModel(entity: FollowEntity, transformOptions = {}): Follow {
    return plainToClass(Follow, entity, transformOptions) as Follow;
  }

  entityToModelMany(entities: FollowEntity[], transformOptions = {}): Follow[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async get(userId: number, targetId: number): Promise<Follow | null> {
    return await this.findOne({
      where: { userId, targetId },
    })
      .then((entity) => {
        if (!entity) {
          return Promise.resolve(null);
        }

        return Promise.resolve(this.entityToModel(entity));
      })
      .catch((error) => Promise.reject(error));
  }

  async checkExist(userId: number, targetId: number): Promise<boolean> {
    const result = await this.createQueryBuilder('follow')
      .select('1')
      .where('follow.userId = :userId', { userId })
      .andWhere('follow.targetId = :targetId', { targetId })
      .take(1)
      .limit(1)
      .execute();
    return result?.length > 0;
  }

  async bulkCheckExist(userId: number, targetIds: number[]) {
    const follows = await this.find({
      select: ['targetId'],
      where: {
        userId,
        targetId: In(targetIds),
      },
    });

    const result = new Map<number, boolean>();
    targetIds.forEach((targetId) => {
      result.set(
        targetId,
        follows.findIndex((follow) => follow.targetId === targetId) >= 0
      );
    });
    return result;
  }
}
