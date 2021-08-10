import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtSellerVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import {
  ExchangeRequestRelationType,
  EXCHANGE_REQUEST_RELATIONS,
} from '@order/exchange-requests/constants';
import { ExchangeRequestFilter } from '@order/exchange-requests/dtos';
import { ExchangeRequest } from '@order/exchange-requests/models';
import { ExchangeRequestsService } from '@order/exchange-requests/exchange-requests.service';

@Injectable()
export class SellerExchangeRequestResolver extends BaseResolver<ExchangeRequestRelationType> {
  relations = EXCHANGE_REQUEST_RELATIONS;

  constructor(
    @Inject(ExchangeRequestsService)
    private readonly exchangeRequestsService: ExchangeRequestsService
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
}
