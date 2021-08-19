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
}
