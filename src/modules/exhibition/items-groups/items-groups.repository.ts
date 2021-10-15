import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { ItemsGroupEntity } from './entities';
import { ItemsGroup } from './models';

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
