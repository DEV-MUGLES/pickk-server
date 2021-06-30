import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@src/common/dtos/pagination.dto';
import { parseFilter } from '@src/common/helpers/filter.helpers';
import { ItemsService } from '@item/items/items.service';

import {
  CouponSpecificationsRepository,
  CouponsRepository,
} from './coupons.repository';
import { Coupon } from './models/coupon.model';
import { CouponFilter } from './dtos/coupon.filter';
import { CouponStatus } from './constants/coupon.enum';
import { CouponSpecification } from './models/coupon-specification.model';
import { CreateCouponSpecificationInput } from './dtos/coupon-specification.input';
import { CreateCouponInput, UpdateCouponInput } from './dtos/coupon.input';
import {
  checkBrand,
  checkExpireAt,
  checkMinimumFotUse,
  checkStatus,
} from './helpers/coupon.helper';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(CouponsRepository)
    private readonly couponsRepository: CouponsRepository,
    @InjectRepository(CouponSpecificationsRepository)
    private readonly couponSpecificationsRepository: CouponSpecificationsRepository,
    private readonly itemsService: ItemsService
  ) {}

  async list(
    couponFilter?: CouponFilter,
    pageInput?: PageInput,
    relations: string[] = []
  ): Promise<Coupon[]> {
    const _couponFilter = plainToClass(CouponFilter, couponFilter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.couponsRepository.entityToModelMany(
      await this.couponsRepository.find({
        relations,
        where: parseFilter(_couponFilter, _pageInput?.idFilter),
        order: {
          id: 'DESC',
        },
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async createSpecification(
    createCouponSpecificationInput: CreateCouponSpecificationInput
  ): Promise<CouponSpecification> {
    const couponsSpecification = new CouponSpecification(
      createCouponSpecificationInput
    );
    return await this.couponSpecificationsRepository.save(couponsSpecification);
  }

  async create(createCouponInput: CreateCouponInput): Promise<Coupon> {
    const { userId, specId } = createCouponInput;
    const myCoupons = await this.list({ userId });
    const hasCoupon = myCoupons.findIndex((v) => v.specId === specId) > -1;

    if (hasCoupon) {
      throw new ForbiddenException('이미 발급한 쿠폰입니다.');
    }

    const coupon = new Coupon({
      ...createCouponInput,
      status: CouponStatus.Ready,
    });
    return await this.couponsRepository.save(coupon);
  }

  async checkUsable(coupon: Coupon, itemId: number): Promise<boolean> {
    const {
      spec: { expireAt, brandId, minimumForUse },
      status,
    } = coupon;
    const { finalPrice, brandId: itemBrandId } = await this.itemsService.get(
      itemId
    );

    return (
      checkStatus(status) &&
      checkExpireAt(expireAt) &&
      checkMinimumFotUse(minimumForUse, finalPrice) &&
      checkBrand(brandId, itemBrandId)
    );
  }

  async update(updateCouponInput: UpdateCouponInput): Promise<UpdateResult> {
    const { id } = updateCouponInput;
    return await this.couponsRepository.update(id, updateCouponInput);
  }

  // async removeExpired() {}
}
