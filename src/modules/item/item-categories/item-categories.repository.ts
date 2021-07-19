import { EntityRepository, TreeRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { ItemCategoryEntity } from './entities';
import { ItemCategory } from './models';

@EntityRepository(ItemCategoryEntity)
export class ItemCategoriesRepository extends TreeRepository<ItemCategoryEntity> {
  entityToModel(
    entity: ItemCategoryEntity,
    transformOptions = {}
  ): ItemCategory {
    return plainToClass(ItemCategory, entity, transformOptions) as ItemCategory;
  }

  entityToModelMany(
    entities: ItemCategoryEntity[],
    transformOptions = {}
  ): ItemCategory[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
