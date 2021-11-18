import { Injectable, UseGuards } from '@nestjs/common';
import { Query, Info, Args, Mutation, Int } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtSellerVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';
import { CacheService } from '@providers/cache/redis';

import { RefundRequestSearchFilter } from '@mcommon/search/dtos';
import { RefundRequestSearchService } from '@mcommon/search/refund-request.search.service';
import {
  RefundRequestRelationType,
  REFUND_REQUEST_RELATIONS,
} from '@order/refund-requests/constants';
import { RefundRequestFilter } from '@order/refund-requests/dtos';
import { RefundRequest } from '@order/refund-requests/models';
import { RefundRequestsService } from '@order/refund-requests/refund-requests.service';

import { RefundRequestsCountOutput, SearchRefundRequestsOutput } from './dtos';

import { SellerRefundRequestService } from './seller-refund-request.service';

@Injectable()
export class SellerRefundRequestResolver extends BaseResolver<RefundRequestRelationType> {
  relations = REFUND_REQUEST_RELATIONS;

  constructor(
    private readonly refundRequestsService: RefundRequestsService,
    private readonly sellerRefundRequestService: SellerRefundRequestService,
    private readonly refundRequestSearchService: RefundRequestSearchService,
    private cacheService: CacheService
  ) {
    super();
  }

  @Query(() => [RefundRequest])
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerRefundRequests(
    @CurrentUser() { sellerId }: JwtPayload,
    @Info() info?: GraphQLResolveInfo,
    @Args('refundRequestFilter', { nullable: true })
    filter?: RefundRequestFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<RefundRequest[]> {
    return await this.refundRequestsService.list(
      {
        sellerId,
        ...filter,
      },
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => RefundRequestsCountOutput)
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerRefundRequestsCount(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('forceUpdate', { nullable: true }) forceUpdate?: boolean
  ): Promise<RefundRequestsCountOutput> {
    if (!forceUpdate) {
      const cached = await this.cacheService.get<RefundRequestsCountOutput>(
        RefundRequestsCountOutput.getCacheKey(sellerId)
      );

      if (cached) {
        return new RefundRequestsCountOutput(cached);
      }
    }

    const count = await this.sellerRefundRequestService.getCount(sellerId);

    await this.cacheService.set<RefundRequestsCountOutput>(
      count.cacheKey,
      count,
      {
        ttl: 60 * 5,
      }
    );

    return count;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtSellerVerifyGuard)
  async bulkPickMeSellerRefundRequests(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('merchantUids', { type: () => [String] })
    merchantUids: string[]
  ): Promise<boolean> {
    await this.sellerRefundRequestService.bulkPick(sellerId, merchantUids);

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtSellerVerifyGuard)
  async confirmMeSellerRefundRequest(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @IntArgs('shippingFee', { description: '부과된 배송비' })
    shippingFee: number
  ): Promise<boolean> {
    await this.sellerRefundRequestService.checkBelongsTo(merchantUid, sellerId);

    await this.refundRequestsService.confirm(merchantUid, shippingFee);

    return true;
  }

  @Mutation(() => RefundRequest)
  @UseGuards(JwtSellerVerifyGuard)
  async convertMeSellerRefundRequest(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('orderItemMerchantUid') orderItemMerchantUid: string,
    @IntArgs('productId') productId: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<RefundRequest> {
    await this.sellerRefundRequestService.checkBelongsTo(merchantUid, sellerId);
    await this.refundRequestsService.convert(
      merchantUid,
      orderItemMerchantUid,
      productId
    );
    return await this.refundRequestsService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => SearchRefundRequestsOutput)
  @UseGuards(JwtSellerVerifyGuard)
  async searchSellerRefundRequests(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('query', { nullable: true }) query?: string,
    @Args('searchFilter', { nullable: true })
    filter?: RefundRequestSearchFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<SearchRefundRequestsOutput> {
    const { ids: merchantUidIn, total } =
      await this.refundRequestSearchService.search(
        query,
        pageInput,
        { sellerId, ...filter },
        [{ merchantUid: 'desc' }]
      );

    const refundRequests = await this.refundRequestsService.list(
      { merchantUidIn },
      null,
      ['order', 'order.buyer', 'shipment']
    );

    return { total, result: refundRequests };
  }

  @Query(() => Int)
  @UseGuards(JwtSellerVerifyGuard)
  async searchSellerRefundRequestsCount(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('query', { nullable: true }) query?: string,
    @Args('searchFilter', { nullable: true })
    filter?: RefundRequestSearchFilter
  ): Promise<number> {
    const { total } = await this.refundRequestSearchService.search(
      query,
      { offset: 0, limit: 0 } as PageInput,
      { sellerId, ...filter }
    );

    return total;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtSellerVerifyGuard)
  async cancelSellerRefundRequest(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('merchantUid') merchantUid: string
  ): Promise<boolean> {
    await this.sellerRefundRequestService.checkBelongsTo(merchantUid, sellerId);
    await this.refundRequestsService.cancel(merchantUid);
    return true;
  }
}
