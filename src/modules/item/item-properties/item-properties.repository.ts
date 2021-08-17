import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { ItemPropertyEntity } from './entities';
import { ItemProperty } from './models';

@EntityRepository(ItemPropertyEntity)
export class ItemPropertiesRepository extends BaseRepository<
  ItemPropertyEntity,
  ItemProperty
> {
  entityToModel(
    entity: ItemPropertyEntity,
    transformOptions = {}
  ): ItemProperty {
    return plainToClass(ItemProperty, entity, transformOptions) as ItemProperty;
  }

  entityToModelMany(
    entities: ItemPropertyEntity[],
    transformOptions = {}
  ): ItemProperty[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
