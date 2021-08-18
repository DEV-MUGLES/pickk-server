import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { StyleTagEntity } from './entities';
import { StyleTag } from './models';

@EntityRepository(StyleTagEntity)
export class StyleTagsRepository extends BaseRepository<
  StyleTagEntity,
  StyleTag
> {
  entityToModel(entity: StyleTagEntity, transformOptions = {}): StyleTag {
    return plainToClass(StyleTag, entity, transformOptions) as StyleTag;
  }

  entityToModelMany(
    entities: StyleTagEntity[],
    transformOptions = {}
  ): StyleTag[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
