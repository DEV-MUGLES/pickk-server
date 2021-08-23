import { EntityRepository, In, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { OwnEntity } from './entities';
import { Own } from './models';

@EntityRepository(OwnEntity)
export class OwnsRepository extends Repository<OwnEntity> {
  entityToModel(entity: OwnEntity, transformOptions = {}): Own {
    return plainToClass(Own, entity, transformOptions) as Own;
  }

  entityToModelMany(entities: OwnEntity[], transformOptions = {}): Own[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async get(userId: number, keywordId: number): Promise<Own | null> {
    return await this.findOne({
      where: { userId, keywordId },
    })
      .then((entity) => {
        if (!entity) {
          return Promise.resolve(null);
        }

        return Promise.resolve(this.entityToModel(entity));
      })
      .catch((error) => Promise.reject(error));
  }

  async checkExist(userId: number, keywordId: number): Promise<boolean> {
    const result = await this.createQueryBuilder('own')
      .select('1')
      .where('own.userId = :userId', { userId })
      .andWhere('own.keywordId = :keywordId', { keywordId })
      .take(1)
      .limit(1)
      .execute();
    return result?.length > 0;
  }

  async bulkCheckExist(userId: number, keywordIds: number[]) {
    const owns = await this.find({
      select: ['keywordId'],
      where: {
        userId,
        keywordId: In(keywordIds),
      },
    });

    const result = new Map<number, boolean>();
    keywordIds.forEach((keywordId) => {
      result.set(
        keywordId,
        owns.findIndex((like) => like.keywordId === keywordId) >= 0
      );
    });
    return result;
  }
}
