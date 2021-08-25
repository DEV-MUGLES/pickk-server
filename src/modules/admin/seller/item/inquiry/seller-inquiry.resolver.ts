import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtSellerVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { BaseResolver } from '@common/base.resolver';
import { CacheService } from '@providers/cache/redis';

import {
  InquiryRelationType,
  INQUIRY_RELATIONS,
} from '@item/inquiries/constants';

import { InquiriesCountOutput } from './dtos';

import { SellerInquiryService } from './seller-inquiry.service';

@Injectable()
export class SellerInquiryResolver extends BaseResolver<InquiryRelationType> {
  relations = INQUIRY_RELATIONS;

  constructor(
    @Inject(SellerInquiryService)
    private readonly sellerInquiryService: SellerInquiryService,
    @Inject(CacheService) private cacheService: CacheService
  ) {
    super();
  }

  @Query(() => InquiriesCountOutput)
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerInquiriesCount(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('forceUpdate', { nullable: true }) forceUpdate?: boolean
  ): Promise<InquiriesCountOutput> {
    if (!forceUpdate) {
      const cached = await this.cacheService.get<InquiriesCountOutput>(
        InquiriesCountOutput.getCacheKey(sellerId)
      );

      if (cached) {
        return new InquiriesCountOutput(cached);
      }
    }

    const count = await this.sellerInquiryService.getCount(sellerId);

    await this.cacheService.set<InquiriesCountOutput>(count.cacheKey, count, {
      ttl: 60 * 5,
    });

    return count;
  }
}
