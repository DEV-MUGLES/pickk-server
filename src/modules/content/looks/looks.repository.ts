import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { LookEntity } from './entities';
import { Look } from './models';

@EntityRepository(LookEntity)
export class LooksRepository extends BaseRepository<LookEntity, Look> {
  entityToModel(entity: LookEntity, transformOptions = {}): Look {
    return plainToClass(Look, entity, transformOptions) as Look;
  }

  entityToModelMany(entities: LookEntity[], transformOptions = {}): Look[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
