import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { DigestEntity } from './entities';
import { Digest } from './models';

@EntityRepository(DigestEntity)
export class DigestsRepository extends BaseRepository<DigestEntity, Digest> {
  entityToModel(entity: DigestEntity, transformOptions = {}): Digest {
    return plainToClass(Digest, entity, transformOptions) as Digest;
  }

  entityToModelMany(entities: DigestEntity[], transformOptions = {}): Digest[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async checkBelongsTo(id: number, userId: number): Promise<boolean> {
    const result = await this.createQueryBuilder('digest')
      .select('1')
      .where('digest.id = :id', { id })
      .andWhere('digest.userId = :userId', { userId })
      .take(1)
      .limit(1)
      .execute();
    return result?.length > 0;
  }
}
