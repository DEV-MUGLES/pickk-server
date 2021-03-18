import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';
import { ShippingAddressEntity } from '../entities/shipping-address.entity';
import { ShippingAddress } from '../models/shipping-address.model';

@EntityRepository(ShippingAddressEntity)
export class ShippingAddressRepository extends BaseRepository<
  ShippingAddressEntity,
  ShippingAddress
> {
  entityToModel(
    entity: ShippingAddressEntity,
    transformOptions = {}
  ): ShippingAddress {
    return plainToClass(
      ShippingAddress,
      entity,
      transformOptions
    ) as ShippingAddress;
  }

  entityToModelMany(
    entities: ShippingAddressEntity[],
    transformOptions = {}
  ): ShippingAddress[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
