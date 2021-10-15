import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { ItemsGroupEntity, ItemsGroupItemEntity } from './entities';
import { ItemsGroup, ItemsGroupItem } from './models';

@EntityRepository(ItemsGroupEntity)
export class ItemsGroupsRepository extends BaseRepository<
  ItemsGroupEntity,
  ItemsGroup
> {
  entityToModel(entity: ItemsGroupEntity, transformOptions = {}): ItemsGroup {
    return plainToClass(ItemsGroup, entity, transformOptions) as ItemsGroup;
  }

  entityToModelMany(
    entities: ItemsGroupEntity[],
    transformOptions = {}
  ): ItemsGroup[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}

@EntityRepository(ItemsGroupItemEntity)
export class ItemsGroupItemsRepository extends BaseRepository<
  ItemsGroupItemEntity,
  ItemsGroupItem
> {
  entityToModel(
    entity: ItemsGroupItemEntity,
    transformOptions = {}
  ): ItemsGroupItem {
    return plainToClass(
      ItemsGroupItem,
      entity,
      transformOptions
    ) as ItemsGroupItem;
  }

  entityToModelMany(
    entities: ItemsGroupItemEntity[],
    transformOptions = {}
  ): ItemsGroupItem[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async findGroupItemIds(itemId: number): Promise<number[]> {
    const itemsGroupItems = await this.createQueryBuilder('itemsGroupItem')
      .select('itemId')
      .where((qb) => {
        return (
          'itemsGroupItem.groupId = ' +
          qb
            .subQuery()
            .select('groupId')
            .from(ItemsGroupItemEntity, 'itemsGroupItem')
            .where(`itemsGroupItem.itemId = ${itemId}`)
            .getQuery()
        );
      })
      .orderBy('itemsGroupItem.order')
      .execute();

    return itemsGroupItems.map((v) => v.itemId);
  }
}
