import { EntityRepository, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { pageQuery } from '@common/helpers';
import { BaseRepository } from '@common/base.repository';

import { DigestFilter } from './dtos';
import { DigestEntity, DigestImageEntity } from './entities';
import { digestItemQuery, digestUserHeightQuery } from './helpers';
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

  async checkRatedExist(userId: number): Promise<boolean> {
    const result = await this.createQueryBuilder('digest')
      .select('1')
      .where('digest.userId = :userId', { userId })
      .andWhere('rating is not null')
      .take(1)
      .limit(1)
      .execute();
    return result?.length > 0;
  }

  async findIds(
    filter: DigestFilter,
    pageInput?: PageInput
  ): Promise<number[]> {
    const qb = pageQuery(
      digestItemQuery(
        digestUserHeightQuery(
          this.createQueryBuilder('digest'),
          filter.user?.heightBetween
        ),
        filter.item
      ),
      'digest',
      pageInput
    )
      .select('digest.id', 'id')
      .orderBy(`digest.${filter?.orderBy ?? 'id'}`, 'DESC');

    if (filter.ratingIsNull != null) {
      qb.where(`digest.rating ${filter?.ratingIsNull ? 'is' : 'is not'} null`);
    }

    const raws = await qb.execute();

    return raws.map((raw) => raw.id);
  }
}

@EntityRepository(DigestImageEntity)
export class DigestImagesRepository extends Repository<DigestImageEntity> {}
