import { EntityRepository } from 'typeorm';
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
}
