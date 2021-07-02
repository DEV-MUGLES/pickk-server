import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@src/common/dtos/pagination.dto';
import { parseFilter } from '@src/common/helpers/filter.helpers';
import { Item } from '@item/items/models/item.model';

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
import { CouponSpecificationFilter } from './dtos/coupon-specification.filter';

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
