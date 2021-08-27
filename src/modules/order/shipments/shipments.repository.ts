import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';

import { ShipmentEntity } from './entities';
import { Shipment } from './models';

@EntityRepository(ShipmentEntity)
export class ShipmentsRepository extends Repository<ShipmentEntity> {
  entityToModel(entity: ShipmentEntity, transformOptions = {}): Shipment {
    return plainToClass(Shipment, entity, transformOptions) as Shipment;
  }

  entityToModelMany(
    entities: ShipmentEntity[],
    transformOptions = {}
  ): Shipment[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
