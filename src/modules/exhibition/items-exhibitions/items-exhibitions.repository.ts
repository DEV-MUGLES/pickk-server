import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { ItemsExhibitionEntity, ItemsExhibitionItemEntity } from './entities';
import { ItemsExhibition, ItemsExhibitionItem } from './models';

@EntityRepository(ItemsExhibitionEntity)
export class ItemsExhibitionsRepository extends BaseRepository<
  ItemsExhibitionEntity,
  ItemsExhibition
> {
  entityToModel(
    entity: ItemsExhibitionEntity,
    transformOptions = {}
  ): ItemsExhibition {
    return plainToClass(
      ItemsExhibition,
      entity,
      transformOptions
    ) as ItemsExhibition;
  }

  entityToModelMany(
    entities: ItemsExhibitionEntity[],
    transformOptions = {}
  ): ItemsExhibition[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}

@EntityRepository(ItemsExhibitionItemEntity)
export class ItemsExhibitionItemsRepository extends BaseRepository<
  ItemsExhibitionItemEntity,
  ItemsExhibitionItem
> {
  entityToModel(
    entity: ItemsExhibitionItemEntity,
    transformOptions = {}
  ): ItemsExhibitionItem {
    return plainToClass(
      ItemsExhibitionItem,
      entity,
      transformOptions
    ) as ItemsExhibitionItem;
  }

  entityToModelMany(
    entities: ItemsExhibitionItemEntity[],
    transformOptions = {}
  ): ItemsExhibitionItem[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
