import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';
import { CartItemEntity } from './entities/cart-item.entity';
import { CartItem } from './models/cart-item.model';

@EntityRepository(CartItemEntity)
export class CartItemsRepository extends BaseRepository<
  CartItemEntity,
  CartItem
> {
  entityToModel(entity: CartItemEntity, transformOptions = {}): CartItem {
    return plainToClass(CartItem, entity, transformOptions) as CartItem;
  }

  entityToModelMany(
    entities: CartItemEntity[],
    transformOptions = {}
  ): CartItem[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
