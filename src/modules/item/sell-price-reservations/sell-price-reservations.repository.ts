import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';
import { SellPriceReservationEntity } from './entities/sell-price-reservation.entity';
import { SellPriceReservation } from './models/sell-price-reservation.model';

@EntityRepository(SellPriceReservationEntity)
export class SellPriceReservationsRepository extends BaseRepository<
  SellPriceReservationEntity,
  SellPriceReservation
> {
  entityToModel(
    entity: SellPriceReservationEntity,
    transformOptions = {}
  ): SellPriceReservation {
    return plainToClass(
      SellPriceReservation,
      entity,
      transformOptions
    ) as SellPriceReservation;
  }

  entityToModelMany(
    entities: SellPriceReservationEntity[],
    transformOptions = {}
  ): SellPriceReservation[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
