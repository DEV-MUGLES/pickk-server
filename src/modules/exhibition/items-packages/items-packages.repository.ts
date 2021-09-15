import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { ItemsPackageEntity, ItemsPackageItemEntity } from './entities';
import { ItemsPackage, ItemsPackageItem } from './models';

@EntityRepository(ItemsPackageEntity)
export class ItemsPackagesRepository extends BaseRepository<
  ItemsPackageEntity,
  ItemsPackage
> {
  entityToModel(
    entity: ItemsPackageEntity,
    transformOptions = {}
  ): ItemsPackage {
    return plainToClass(ItemsPackage, entity, transformOptions) as ItemsPackage;
  }

  entityToModelMany(
    entities: ItemsPackageEntity[],
    transformOptions = {}
  ): ItemsPackage[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}

@EntityRepository(ItemsPackageItemEntity)
export class ItemsPackageItemsRepository extends BaseRepository<
  ItemsPackageItemEntity,
  ItemsPackageItem
> {
  entityToModel(
    entity: ItemsPackageItemEntity,
    transformOptions = {}
  ): ItemsPackageItem {
    return plainToClass(
      ItemsPackageItem,
      entity,
      transformOptions
    ) as ItemsPackageItem;
  }

  entityToModelMany(
    entities: ItemsPackageItemEntity[],
    transformOptions = {}
  ): ItemsPackageItem[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
