import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { ItemPropertyEntity, ItemPropertyValueEntity } from './entities';
import { ItemProperty, ItemPropertyValue } from './models';

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

@EntityRepository(ItemPropertyValueEntity)
export class ItemPropertyValuesRepository extends BaseRepository<
  ItemPropertyValueEntity,
  ItemPropertyValue
> {
  entityToModel(
    entity: ItemPropertyValueEntity,
    transformOptions = {}
  ): ItemPropertyValue {
    return plainToClass(
      ItemPropertyValue,
      entity,
      transformOptions
    ) as ItemPropertyValue;
  }

  entityToModelMany(
    entities: ItemPropertyValueEntity[],
    transformOptions = {}
  ): ItemPropertyValue[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
