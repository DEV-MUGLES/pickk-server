import { EntityRepository, In } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { CartItemEntity } from './entities';
import { CartItem } from './models';

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

  async checkExist(userId: number, productId: number): Promise<boolean> {
    const result = await this.createQueryBuilder('cartItem')
      .select('1')
      .where('cartItem.userId = :userId', { userId })
      .andWhere('cartItem.productId = :productId', { productId })
      .take(1)
      .limit(1)
      .execute();
    return result?.length > 0;
  }
}
