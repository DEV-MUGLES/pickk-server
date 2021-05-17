import { DeepPartial, EntityRepository, getConnection, In } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';
import { ItemEntity } from './entities/item.entity';
import { Item } from './models/item.model';

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
