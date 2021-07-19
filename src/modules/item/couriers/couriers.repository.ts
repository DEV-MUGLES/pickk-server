import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { CourierEntity } from './entities';
import { Courier } from './models';

@EntityRepository(CourierEntity)
export class CouriersRepository extends BaseRepository<CourierEntity, Courier> {
  entityToModel(entity: CourierEntity, transformOptions = {}): Courier {
    return plainToClass(Courier, entity, transformOptions) as Courier;
  }

  entityToModelMany(
    entities: CourierEntity[],
    transformOptions = {}
  ): Courier[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
