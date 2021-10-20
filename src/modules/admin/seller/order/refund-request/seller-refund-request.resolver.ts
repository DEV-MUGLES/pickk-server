import { Injectable, UseGuards } from '@nestjs/common';
import { Query, Info, Args, Mutation } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtSellerVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';
import { CacheService } from '@providers/cache/redis';

import {
  RefundRequestRelationType,
  REFUND_REQUEST_RELATIONS,
} from '@order/refund-requests/constants';
import { RefundRequestFilter } from '@order/refund-requests/dtos';
import { RefundRequest } from '@order/refund-requests/models';
import { RefundRequestsService } from '@order/refund-requests/refund-requests.service';

import { RefundRequestsCountOutput } from './dtos';

import { SellerRefundRequestService } from './seller-refund-request.service';

@Injectable()
export class SellerRefundRequestResolver extends BaseResolver<RefundRequestRelationType> {
  relations = REFUND_REQUEST_RELATIONS;

  constructor(
    private readonly refundRequestsService: RefundRequestsService,
    private readonly sellerRefundRequestService: SellerRefundRequestService,
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
}
