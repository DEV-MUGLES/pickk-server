import { DeepPartial, EntityRepository, getConnection, In } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';
import { ImageRepository } from '@common/image.repository';

import {
  ItemEntity,
  ItemSizeChartEntity,
  ItemOptionEntity,
  ItemOptionValueEntity,
  ItemDetailImageEntity,
  ItemPriceEntity,
} from './entities';
import {
  Item,
  ItemSizeChart,
  ItemOption,
  ItemOptionValue,
  ItemPrice,
  ItemDetailImage,
} from './models';

@EntityRepository(ItemEntity)
export class ItemsRepository extends BaseRepository<ItemEntity, Item> {
  entityToModel(entity: ItemEntity, transformOptions = {}): Item {
    return plainToClass(Item, entity, transformOptions) as Item;
  }

  entityToModelMany(entities: ItemEntity[], transformOptions = {}): Item[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async bulkUpdate(
    ids: number[],
    input: DeepPartial<ItemEntity>
  ): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(ItemEntity)
      .set({ ...input })
      .where({ id: In(ids) })
      .execute();
  }
}

@EntityRepository(ItemOptionEntity)
export class ItemOptionsRepository extends BaseRepository<
  ItemOptionEntity,
  ItemOption
> {
  entityToModel(entity: ItemOptionEntity, transformOptions = {}): ItemOption {
    return plainToClass(ItemOption, entity, transformOptions) as ItemOption;
  }

  entityToModelMany(
    entities: ItemOptionEntity[],
    transformOptions = {}
  ): ItemOption[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}

@EntityRepository(ItemOptionValueEntity)
export class ItemOptionValuesRepository extends BaseRepository<
  ItemOptionValueEntity,
  ItemOptionValue
> {
  entityToModel(
    entity: ItemOptionValueEntity,
    transformOptions = {}
  ): ItemOptionValue {
    return plainToClass(
      ItemOptionValue,
      entity,
      transformOptions
    ) as ItemOptionValue;
  }

  entityToModelMany(
    entities: ItemOptionValueEntity[],
    transformOptions = {}
  ): ItemOptionValue[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}

@EntityRepository(ItemPriceEntity)
export class ItemPricesRepository extends BaseRepository<
  ItemPriceEntity,
  ItemPrice
> {
  entityToModel(entity: ItemPriceEntity, transformOptions = {}): ItemPrice {
    return plainToClass(ItemPrice, entity, transformOptions) as ItemPrice;
  }

  entityToModelMany(
    entities: ItemPriceEntity[],
    transformOptions = {}
  ): ItemPrice[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}

@EntityRepository(ItemDetailImageEntity)
export class ItemDetailImagesRepository extends ImageRepository<
  ItemDetailImageEntity,
  ItemDetailImage
> {
  entityToModel(
    entity: ItemDetailImageEntity,
    transformOptions = {}
  ): ItemDetailImage {
    return plainToClass(
      ItemDetailImage,
      entity,
      transformOptions
    ) as ItemDetailImage;
  }

  entityToModelMany(
    entities: ItemDetailImageEntity[],
    transformOptions = {}
  ): ItemDetailImage[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}

@EntityRepository(ItemSizeChartEntity)
export class ItemSizeChartsRepository extends BaseRepository<
  ItemSizeChartEntity,
  ItemSizeChart
> {
  entityToModel(
    entity: ItemSizeChartEntity,
    transformOptions = {}
  ): ItemSizeChart {
    return plainToClass(
      ItemSizeChart,
      entity,
      transformOptions
    ) as ItemSizeChart;
  }

  entityToModelMany(
    entities: ItemSizeChartEntity[],
    transformOptions = {}
  ): ItemSizeChart[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async bulkDelete(ids: number[]): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(ItemSizeChartEntity)
      .where({ id: In(ids) })
      .execute();
  }
}
