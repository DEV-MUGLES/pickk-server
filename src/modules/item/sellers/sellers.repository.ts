import { BaseRepository } from '@src/common/base.repository';
import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

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
