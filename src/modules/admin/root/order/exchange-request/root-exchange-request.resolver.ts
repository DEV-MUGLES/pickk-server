import { Injectable, UseGuards } from '@nestjs/common';
import { Info, Args, Query, Int } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { BaseResolver } from '@common/base.resolver';
import { PageInput } from '@common/dtos';

import { UserRole } from '@user/users/constants';
import {
  ExchangeRequestSearchFilter,
  SearchExchangeRequestsOutput,
} from '@mcommon/search/dtos';
import { ExchangeRequestSearchService } from '@mcommon/search/exchange-request.search.service';

import {
  ExchangeRequestRelationType,
  EXCHANGE_REQUEST_RELATIONS,
} from '@order/exchange-requests/constants';
import { ExchangeRequestFilter } from '@order/exchange-requests/dtos';
import { ExchangeRequest } from '@order/exchange-requests/models';
import { ExchangeRequestsService } from '@order/exchange-requests/exchange-requests.service';

@Injectable()
export class RootExchangeRequestResolver extends BaseResolver<
  ExchangeRequestRelationType
> {
  relations = EXCHANGE_REQUEST_RELATIONS;

  constructor(
    private readonly exchangeRequestsService: ExchangeRequestsService,
    private readonly exchangeRequestSearchService: ExchangeRequestSearchService
  ) {
    super();
  }

  @Query(() => [ExchangeRequest])
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  async rootExchangeRequests(
    @Info() info?: GraphQLResolveInfo,
    @Args('exchangeRequestFilter', { nullable: true })
    filter?: ExchangeRequestFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<ExchangeRequest[]> {
    return await this.exchangeRequestsService.list(
      filter,
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => SearchExchangeRequestsOutput)
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  async searchRootExchangeRequests(
    @Args('query', { nullable: true }) query?: string,
    @Args('searchFilter', { nullable: true })
    filter?: ExchangeRequestSearchFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<SearchExchangeRequestsOutput> {
    const {
      ids: merchantUidIn,
      total,
    } = await this.exchangeRequestSearchService.search(
      query,
      pageInput,
      filter,
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
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  async searchRootExchangeRequestsCount(
    @Args('query', { nullable: true }) query?: string,
    @Args('searchFilter', { nullable: true })
    filter?: ExchangeRequestSearchFilter
  ): Promise<number> {
    const { total } = await this.exchangeRequestSearchService.search(
      query,
      { offset: 0, limit: 0 } as PageInput,
      filter
    );

    return total;
  }
}
