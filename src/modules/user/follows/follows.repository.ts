import { EntityRepository, Repository } from 'typeorm';
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
}
