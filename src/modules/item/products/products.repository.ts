import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';
import { ProductEntity } from './entities/product.entity';
import { Product } from './models/product.model';

@EntityRepository(ProductEntity)
export class ProductsRepository extends BaseRepository<ProductEntity, Product> {
  entityToModel(entity: ProductEntity, transformOptions = {}): Product {
    return plainToClass(Product, entity, transformOptions) as Product;
  }

  entityToModelMany(
    entities: ProductEntity[],
    transformOptions = {}
  ): Product[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
