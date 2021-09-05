import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { DigestsExhibitionEntity } from './entities';
import { DigestsExhibition } from './models';

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
