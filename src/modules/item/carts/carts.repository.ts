import { EntityRepository, In } from 'typeorm';
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

  async countByUserId(userId: number): Promise<number> {
    return this.createQueryBuilder('cartItem')
      .where('cartItem.userId = :userId', { userId })
      .getCount();
  }

  async bulkDelete(ids: number[]): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .where({ id: In(ids) })
      .execute();
  }
}
