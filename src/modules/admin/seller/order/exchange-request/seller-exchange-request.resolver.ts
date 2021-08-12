import {
  ForbiddenException,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtSellerVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';
import { CacheService } from '@providers/cache/redis';

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

import { ExchangeRequestsCountOutput } from './dtos';

import { SellerExchangeRequestService } from './seller-exchange-request.service';

@Injectable()
export class SellerExchangeRequestResolver extends BaseResolver<ExchangeRequestRelationType> {
  relations = EXCHANGE_REQUEST_RELATIONS;

  constructor(
    @Inject(ExchangeRequestsService)
    private readonly exchangeRequestsService: ExchangeRequestsService,
    @Inject(SellerExchangeRequestService)
    private readonly sellerExchangeRequestService: SellerExchangeRequestService,
    @Inject(CacheService) private cacheService: CacheService
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
        cached.lastUpdatedAt = new Date(cached.lastUpdatedAt);
        return cached;
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
    @Args('ids', { type: () => [Int] })
    ids: number[]
  ): Promise<boolean> {
    await this.sellerExchangeRequestService.bulkPick(sellerId, ids);

    return true;
  }

  @Mutation(() => ExchangeRequest)
  @UseGuards(JwtSellerVerifyGuard)
  async reshipMeSellerExchangeRequest(
    @CurrentUser() { sellerId }: JwtPayload,
    @IntArgs('id') id: number,
    @Args('reshipExchangeRequestInput') input: ReshipExchangeRequestInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<ExchangeRequest> {
    const exchangeRequest = await this.exchangeRequestsService.get(id);
    if (exchangeRequest.sellerId !== sellerId) {
      throw new ForbiddenException('해당 교환 요청에 대한 권한이 없습니다.');
    }

    await this.sellerExchangeRequestService.reship(exchangeRequest, input);

    return await this.exchangeRequestsService.get(
      id,
      this.getRelationsFromInfo(info)
    );
  }
}