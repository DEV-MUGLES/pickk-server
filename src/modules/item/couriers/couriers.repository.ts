import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';

import { CourierEntity } from './entities/courier.entity';
import { Courier } from './models/courier.model';

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
