import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { CouponEntity, CouponSpecificationEntity } from './entities';
import { Coupon, CouponSpecification } from './models';

@EntityRepository(CouponEntity)
export class CouponsRepository extends BaseRepository<CouponEntity, Coupon> {
  entityToModel(entity: CouponEntity, transformOptions = {}): Coupon {
    return plainToClass(Coupon, entity, transformOptions) as Coupon;
  }

  entityToModelMany(entities: CouponEntity[], transformOptions = {}): Coupon[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async checkExist(userId: number, specId: number): Promise<boolean> {
    const result = await this.createQueryBuilder('coupon')
      .select('1')
      .where('coupon.userId = :userId', { userId })
      .andWhere('coupon.specId = :specId', { specId })
      .take(1)
      .limit(1)
      .execute();
    return result?.length > 0;
  }
}

@EntityRepository(CouponSpecificationEntity)
export class CouponSpecificationsRepository extends BaseRepository<
  CouponSpecificationEntity,
  CouponSpecification
> {
  entityToModel(
    entity: CouponSpecificationEntity,
    transformOptions = {}
  ): CouponSpecification {
    return plainToClass(
      CouponSpecification,
      entity,
      transformOptions
    ) as CouponSpecification;
  }

  entityToModelMany(
    entities: CouponSpecificationEntity[],
    transformOptions = {}
  ): CouponSpecification[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
