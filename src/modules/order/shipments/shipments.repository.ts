import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';

import { ShipmentEntity, ShipmentHistoryEntity } from './entities';
import { Shipment, ShipmentHistory } from './models';

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

@EntityRepository(ShipmentHistoryEntity)
export class ShipmentHistoriesRepository extends Repository<ShipmentHistoryEntity> {
  entityToModel(
    entity: ShipmentHistoryEntity,
    transformOptions = {}
  ): ShipmentHistory {
    return plainToClass(
      ShipmentHistory,
      entity,
      transformOptions
    ) as ShipmentHistory;
  }

  entityToModelMany(
    entities: ShipmentHistoryEntity[],
    transformOptions = {}
  ): ShipmentHistory[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
