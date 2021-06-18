import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@src/common/dtos/pagination.dto';
import { parseFilter } from '@src/common/helpers/filter.helpers';

import { CouponsRepository } from './coupons.repository';
import { Coupon } from './models/coupon.model';
import { CouponFilter } from './dtos/coupon.filter';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(CouponsRepository)
    private readonly couponsRepository: CouponsRepository
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
}
