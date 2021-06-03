import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';

import { CouponEntity } from './entities/coupon.entity';
import { Coupon } from './models/coupon.model';
import { CouponSpecificationEntity } from './entities/coupon-specification.entity';
import { CouponSpecification } from './models/coupon-specification.model';

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
