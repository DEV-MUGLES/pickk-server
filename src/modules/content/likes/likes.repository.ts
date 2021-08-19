import { EntityRepository, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { LikeOwnerType } from './constants';
import { LikeEntity } from './entities';
import { Like } from './models';

@EntityRepository(LikeEntity)
export class LikesRepository extends Repository<LikeEntity> {
  entityToModel(entity: LikeEntity, transformOptions = {}): Like {
    return plainToClass(Like, entity, transformOptions) as Like;
  }

  entityToModelMany(entities: LikeEntity[], transformOptions = {}): Like[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async get(
    userId: number,
    ownerType: LikeOwnerType,
    ownerId: number
  ): Promise<Like | null> {
    return await this.findOne({
      where: { userId, ownerType, ownerId },
    })
      .then((entity) => {
        if (!entity) {
          return Promise.resolve(null);
        }

        return Promise.resolve(this.entityToModel(entity));
      })
      .catch((error) => Promise.reject(error));
  }

  async checkExist(
    userId: number,
    ownerType: LikeOwnerType,
    ownerId: number
  ): Promise<boolean> {
    const result = await this.createQueryBuilder('like')
      .select('1')
      .where('like.userId = :userId', { userId })
      .andWhere('like.ownerType = :ownerType', { ownerType })
      .andWhere('like.ownerId = :ownerId', { ownerId })
      .take(1)
      .limit(1)
      .execute();
    return result?.length > 0;
  }
}
