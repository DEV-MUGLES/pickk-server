import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';
import { ItemProfileEntity } from './entities/item-profile.entity';
import { ItemProfile } from './models/item-profile.model';

@EntityRepository(ItemProfileEntity)
export class ItemProfilesRepository extends BaseRepository<
  ItemProfileEntity,
  ItemProfile
> {
  entityToModel(entity: ItemProfileEntity, transformOptions = {}): ItemProfile {
    return plainToClass(ItemProfile, entity, transformOptions) as ItemProfile;
  }

  entityToModelMany(
    entities: ItemProfileEntity[],
    transformOptions = {}
  ): ItemProfile[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
