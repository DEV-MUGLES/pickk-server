import { BaseRepository } from '@src/common/base.repository';
import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { ItemCategoryEntity } from './entities/item-category.entity';
import { ItemCategory } from './models/item-category.model';

@EntityRepository(ItemCategoryEntity)
export class ItemCategoriesRepository extends BaseRepository<
  ItemCategoryEntity,
  ItemCategory
> {
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
