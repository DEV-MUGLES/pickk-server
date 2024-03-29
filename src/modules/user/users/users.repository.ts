import { NotFoundException } from '@nestjs/common';
import { EntityRepository, getConnection } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { diffArr } from '@common/helpers';
import { BaseRepository } from '@common/base.repository';

import {
  RefundAccountEntity,
  ShippingAddressEntity,
  UserEntity,
} from './entities';
import { RefundAccount, ShippingAddress, User } from './models';

@EntityRepository(UserEntity)
export class UsersRepository extends BaseRepository<UserEntity, User> {
  entityToModel(entity: UserEntity, transformOptions = {}): User {
    return plainToClass(User, entity, transformOptions) as User;
  }

  entityToModelMany(entities: UserEntity[], transformOptions = {}): User[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async checkExist(nickname: string): Promise<boolean> {
    const result = await this.createQueryBuilder('user')
      .select('1')
      .where('user.nickname = :nickname', { nickname })
      .take(1)
      .limit(1)
      .execute();
    return result?.length > 0;
  }

  async getNicknameOnly(id: number): Promise<Pick<User, 'id' | 'nickname'>> {
    return await this.findOne({
      where: { id },
      select: ['id', 'nickname'],
    }).then((entity) => {
      if (!this.isEntity(entity)) {
        throw new NotFoundException('Model not found.');
      }

      return Promise.resolve(this.entityToModel(entity));
    });
  }

  async updateStyleTagRelations(
    userId: number,
    newIds: number[]
  ): Promise<void> {
    const USER_STYLETAGS_TABLE = 'user_style_tags_style_tag';

    const runner = getConnection().createQueryRunner();
    const records = await runner.query(
      `SELECT * FROM ${USER_STYLETAGS_TABLE} WHERE userId=${userId}`
    );
    runner.release();

    const existingIds = records.map((r) => r.styleTagId);

    const removedIds = diffArr(existingIds, newIds);
    await this.removeStyleTagRelations(userId, removedIds);

    const addingIds = diffArr(newIds, existingIds);
    await this.addStyleTagRelations(userId, addingIds);
  }

  async removeStyleTagRelations(userId: number, styleTagIds: number[]) {
    if (styleTagIds?.length === 0) {
      return;
    }

    const USER_STYLETAGS_TABLE = 'user_style_tags_style_tag';

    await getConnection().createQueryRunner().query(`
        DELETE FROM ${USER_STYLETAGS_TABLE}
        WHERE
          userId = ${userId} AND
          styleTagId in (${styleTagIds.join(', ')})
      `);
  }

  async addStyleTagRelations(userId: number, styleTagIds: number[]) {
    if (styleTagIds?.length === 0) {
      return;
    }

    const USER_STYLETAGS_TABLE = 'user_style_tags_style_tag';

    await getConnection().createQueryRunner().query(`
        INSERT INTO ${USER_STYLETAGS_TABLE} (userId, styleTagId)
        VALUES ${styleTagIds.map((sId) => `(${userId}, ${sId})`).join(', ')}
      `);
  }
}

@EntityRepository(ShippingAddressEntity)
export class ShippingAddressesRepository extends BaseRepository<
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

  async checkBelongsTo(id: number, userId: number): Promise<boolean> {
    const result = await this.createQueryBuilder('shipping_address')
      .select('1')
      .where('shipping_address.id = :id', { id })
      .andWhere('shipping_address.userId = :userId', { userId })
      .execute();
    return result?.length > 0;
  }
}

@EntityRepository(RefundAccountEntity)
export class RefundAccountsRepository extends BaseRepository<
  RefundAccountEntity,
  RefundAccount
> {
  entityToModel(
    entity: RefundAccountEntity,
    transformOptions = {}
  ): RefundAccount {
    return plainToClass(
      RefundAccount,
      entity,
      transformOptions
    ) as RefundAccount;
  }

  entityToModelMany(
    entities: RefundAccountEntity[],
    transformOptions = {}
  ): RefundAccount[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async checkBelongsTo(id: number, userId: number): Promise<boolean> {
    const result = await this.createQueryBuilder('refund_account')
      .select('1')
      .where('refund_account.id = :id', { id })
      .andWhere('refund_account.userId = :userId', { userId })
      .execute();
    return result?.length > 0;
  }
}
