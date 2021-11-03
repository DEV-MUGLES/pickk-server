import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtSellerVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';
import { CacheService } from '@providers/cache/redis';
import {
  ExchangeRequestSearchFilter,
  SearchExchangeRequestsOutput,
} from '@mcommon/search/dtos';

import { ExchangeRequestSearchService } from '@mcommon/search/exchange-request.search.service';
import {
  ExchangeRequestRelationType,
  EXCHANGE_REQUEST_RELATIONS,
} from '@order/exchange-requests/constants';
import {
  ExchangeRequestFilter,
  ReshipExchangeRequestInput,
} from '@order/exchange-requests/dtos';
import { ExchangeRequest } from '@order/exchange-requests/models';
import { ExchangeRequestsService } from '@order/exchange-requests/exchange-requests.service';
import { ExchangeRequestsProducer } from '@order/exchange-requests/producers';

import { ExchangeRequestsCountOutput } from './dtos';

import { SellerExchangeRequestService } from './seller-exchange-request.service';

@Injectable()
export class SellerExchangeRequestResolver extends BaseResolver<ExchangeRequestRelationType> {
  relations = EXCHANGE_REQUEST_RELATIONS;

  constructor(
    private readonly exchangeRequestsService: ExchangeRequestsService,
    private readonly sellerExchangeRequestService: SellerExchangeRequestService,
    private readonly exchangeRequestsProducer: ExchangeRequestsProducer,
    private readonly exchangeRequestSearchService: ExchangeRequestSearchService,
    private cacheService: CacheService
  ) {
    super();
  }

  @Query(() => [ExchangeRequest])
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerExchangeRequests(
    @CurrentUser() { sellerId }: JwtPayload,
    @Info() info?: GraphQLResolveInfo,
    @Args('exchangeRequestFilter', { nullable: true })
    filter?: ExchangeRequestFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<ExchangeRequest[]> {
    return await this.exchangeRequestsService.list(
      {
        sellerId,
        ...filter,
      },
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => ExchangeRequestsCountOutput)
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerExchangeRequestsCount(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('forceUpdate', { nullable: true }) forceUpdate?: boolean
  ): Promise<ExchangeRequestsCountOutput> {
    if (!forceUpdate) {
      const cached = await this.cacheService.get<ExchangeRequestsCountOutput>(
        ExchangeRequestsCountOutput.getCacheKey(sellerId)
      );

      if (cached) {
        return new ExchangeRequestsCountOutput(cached);
      }
    }

    const count = await this.sellerExchangeRequestService.getCount(sellerId);

    await this.cacheService.set<ExchangeRequestsCountOutput>(
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
  async bulkPickMeSellerExchangeRequests(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('merchantUids', { type: () => [String] })
    merchantUids: string[]
  ): Promise<boolean> {
    await this.sellerExchangeRequestService.bulkPick(sellerId, merchantUids);

    return true;
  }

  @Mutation(() => ExchangeRequest)
  @UseGuards(JwtSellerVerifyGuard)
  async reshipMeSellerExchangeRequest(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('reshipExchangeRequestInput') input: ReshipExchangeRequestInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<ExchangeRequest> {
    await this.sellerExchangeRequestService.checkBelongsTo(
      merchantUid,
      sellerId
    );

    await this.sellerExchangeRequestService.reship(merchantUid, input);
    await this.exchangeRequestsProducer.sendExchangeItemReshipedAlimtalk(
      merchantUid
    );
    return await this.exchangeRequestsService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => ExchangeRequest)
  @UseGuards(JwtSellerVerifyGuard)
  async convertMeSellerExchangeRequest(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Info() info?: GraphQLResolveInfo
  ): Promise<ExchangeRequest> {
    await this.sellerExchangeRequestService.checkBelongsTo(
      merchantUid,
      sellerId
    );
    await this.exchangeRequestsService.convert(merchantUid);
    return await this.exchangeRequestsService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => SearchExchangeRequestsOutput)
  @UseGuards(JwtSellerVerifyGuard)
  async searchSellerExchangeRequests(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('query', { nullable: true }) query?: string,
    @Args('searchFilter', { nullable: true })
    filter?: ExchangeRequestSearchFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<SearchExchangeRequestsOutput> {
    const { ids: merchantUidIn, total } =
      await this.exchangeRequestSearchService.search(
        query,
        pageInput,
        { ...filter, sellerId },
        [{ merchantUid: 'desc' }]
      );

    const exchangeRequests = await this.exchangeRequestsService.list(
      { merchantUidIn },
      null,
      [
        'orderItem',
        'orderItem.order',
        'orderItem.order.buyer',
        'reShipment',
        'pickShipment',
      ]
    );

    return { total, result: exchangeRequests };
  }

  @Query(() => Int)
  @UseGuards(JwtSellerVerifyGuard)
  async searchSellerExchangeRequestsCount(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('query', { nullable: true }) query?: string,
    @Args('searchFilter', { nullable: true })
    filter?: ExchangeRequestSearchFilter
  ): Promise<number> {
    const { total } = await this.exchangeRequestSearchService.search(
      query,
      { offset: 0, limit: 0 } as PageInput,
      { ...filter, sellerId }
    );

    return total;
  }
}
