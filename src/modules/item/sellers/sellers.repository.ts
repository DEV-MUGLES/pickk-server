import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { SellerEntity } from './entities/seller.entity';
import { Seller } from './models/seller.model';

@EntityRepository(SellerEntity)
export class SellersRepository extends BaseRepository<SellerEntity, Seller> {
  entityToModel(entity: SellerEntity, transformOptions = {}): Seller {
    return plainToClass(Seller, entity, transformOptions) as Seller;
  }

  entityToModelMany(entities: SellerEntity[], transformOptions = {}): Seller[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
