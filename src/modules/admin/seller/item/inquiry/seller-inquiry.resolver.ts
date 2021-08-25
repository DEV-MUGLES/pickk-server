import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtSellerVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { BaseResolver } from '@common/base.resolver';
import { CacheService } from '@providers/cache/redis';

import { PageInput } from '@common/dtos';
import {
  InquiryRelationType,
  INQUIRY_RELATIONS,
} from '@item/inquiries/constants';
import { InquiryFilter } from '@item/inquiries/dtos';
import { Inquiry } from '@item/inquiries/models';
import { InquiriesService } from '@item/inquiries/inquiries.service';

import { InquiriesCountOutput } from './dtos';

import { SellerInquiryService } from './seller-inquiry.service';
@Injectable()
export class SellerInquiryResolver extends BaseResolver<InquiryRelationType> {
  relations = INQUIRY_RELATIONS;

  constructor(
    @Inject(InquiriesService)
    private readonly inquiriesService: InquiriesService,
    @Inject(SellerInquiryService)
    private readonly sellerInquiryService: SellerInquiryService,
    @Inject(CacheService) private cacheService: CacheService
  ) {
    super();
  }

  @Query(() => [Inquiry])
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerInquiries(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('filter', { nullable: true }) filter: InquiryFilter,
    @Args('pageInput', { nullable: true }) pageInput: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Inquiry[]> {
    return await this.inquiriesService.list(
      {
        sellerId,
        ...filter,
      },
      pageInput,
      this.getRelationsFromInfo(info)
    );
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
