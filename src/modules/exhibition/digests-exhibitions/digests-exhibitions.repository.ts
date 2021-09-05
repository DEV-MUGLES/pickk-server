import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import {
  DigestsExhibitionEntity,
  DigestsExhibitionDigestEntity,
} from './entities';
import { DigestsExhibition, DigestsExhibitionDigest } from './models';

@EntityRepository(DigestsExhibitionEntity)
export class DigestsExhibitionsRepository extends BaseRepository<
  DigestsExhibitionEntity,
  DigestsExhibition
> {
  entityToModel(
    entity: DigestsExhibitionEntity,
    transformOptions = {}
  ): DigestsExhibition {
    return plainToClass(
      DigestsExhibition,
      entity,
      transformOptions
    ) as DigestsExhibition;
  }

  entityToModelMany(
    entities: DigestsExhibitionEntity[],
    transformOptions = {}
  ): DigestsExhibition[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}

@EntityRepository(DigestsExhibitionDigestEntity)
export class DigestsExhibitionDigestsRepository extends BaseRepository<
  DigestsExhibitionDigestEntity,
  DigestsExhibitionDigest
> {
  entityToModel(
    entity: DigestsExhibitionDigestEntity,
    transformOptions = {}
  ): DigestsExhibitionDigest {
    return plainToClass(
      DigestsExhibitionDigest,
      entity,
      transformOptions
    ) as DigestsExhibitionDigest;
  }

  entityToModelMany(
    entities: DigestsExhibitionDigestEntity[],
    transformOptions = {}
  ): DigestsExhibitionDigest[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
