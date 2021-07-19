import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { BrandEntity } from './entities/brand.entity';
import { Brand } from './models/brand.model';

@EntityRepository(BrandEntity)
export class BrandsRepository extends BaseRepository<BrandEntity, Brand> {
  entityToModel(entity: BrandEntity, transformOptions = {}): Brand {
    return plainToClass(Brand, entity, transformOptions) as Brand;
  }

  entityToModelMany(entities: BrandEntity[], transformOptions = {}): Brand[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
