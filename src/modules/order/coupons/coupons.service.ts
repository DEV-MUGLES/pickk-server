import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { Item } from '@item/items/models';

import { CouponStatus } from './constants';
import {
  CreateCouponInput,
  UpdateCouponInput,
  CouponSpecificationFilter,
  CouponFilter,
  CreateCouponSpecificationInput,
} from './dtos';
import { Coupon, CouponSpecification } from './models';

import {
  CouponSpecificationsRepository,
  CouponsRepository,
} from './coupons.repository';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(CouponsRepository)
    private readonly couponsRepository: CouponsRepository,
    @InjectRepository(CouponSpecificationsRepository)
    private readonly couponSpecificationsRepository: CouponSpecificationsRepository
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

  async listSpecifications(
    couponSpecificationFilter?: CouponSpecificationFilter,
    pageInput?: PageInput,
    relations: string[] = []
  ) {
    const _couponSpecificationFilter = plainToClass(
      CouponSpecificationFilter,
      couponSpecificationFilter
    );
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.couponSpecificationsRepository.entityToModelMany(
      await this.couponSpecificationsRepository.find({
        relations,
        where: parseFilter(_couponSpecificationFilter, _pageInput?.idFilter),
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
    const isExist = await this.couponsRepository.checkExist(userId, specId);

    if (isExist) {
      throw new ConflictException('이미 발급한 쿠폰입니다.');
    }

    const coupon = new Coupon({
      ...createCouponInput,
      status: CouponStatus.Ready,
    });
    return await this.couponsRepository.save(coupon);
  }

  async update(
    couponId: number,
    updateCouponInput: UpdateCouponInput
  ): Promise<UpdateResult> {
    return await this.couponsRepository.update(couponId, updateCouponInput);
  }

  async removeExpired() {
    const currentDate = new Date();
    const expiredCouponSpecifications = await this.listSpecifications({
      expireAtLte: currentDate,
    });
    await this.couponSpecificationsRepository.remove(
      expiredCouponSpecifications
    );
  }

  checkUsable(coupon: Coupon, item: Item): boolean {
    return coupon.checkUsableOn(item);
  }
}
