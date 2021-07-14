import { EntityRepository, In } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';
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

  async findByIds(ids: number[]): Promise<Product[]> {
    const entities = await this.find({
      relations: ['item', 'itemOptionValues', 'shippingReservePolicy'],
      where: {
        id: In(ids),
      },
    });
    return this.entityToModelMany(entities);
  }
}
