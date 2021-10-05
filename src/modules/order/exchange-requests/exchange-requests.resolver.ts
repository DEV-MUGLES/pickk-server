import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { BaseResolver } from '@common/base.resolver';

import { OrderItemsService } from '@order/order-items/order-items.service';

import {
  ExchangeRequestRelationType,
  EXCHANGE_REQUEST_RELATIONS,
} from './constants';
import { RegisterExchangeRequestInput } from './dtos';
import { ExchangeRequest } from './models';
import { ExchangeRequestsProducer } from './producers';

import { ExchangeRequestsService } from './exchange-requests.service';

@Resolver(() => ExchangeRequest)
export class ExchangeRequestsResolver extends BaseResolver<ExchangeRequestRelationType> {
  relations = EXCHANGE_REQUEST_RELATIONS;

  constructor(
    private readonly exchangeRequestsService: ExchangeRequestsService,
    private readonly orderItemsService: OrderItemsService,
    private readonly exchangeRequestsProducer: ExchangeRequestsProducer
  ) {
    super();
  }

  @Mutation(() => ExchangeRequest)
  @UseGuards(JwtVerifyGuard)
  async registerExchangeRequest(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('registerExchangeRequestInput')
    input: RegisterExchangeRequestInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<ExchangeRequest> {
    await this.orderItemsService.checkBelongsTo(merchantUid, userId);

    await this.exchangeRequestsService.register(merchantUid, input);

    return await this.exchangeRequestsService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => ExchangeRequest)
  @UseGuards(JwtVerifyGuard)
  async completeExchangeRequest(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Info() info?: GraphQLResolveInfo
  ): Promise<ExchangeRequest> {
    await this.orderItemsService.checkBelongsTo(merchantUid, userId);

    await this.exchangeRequestsService.complete(merchantUid);

    await this.exchangeRequestsProducer.sendExchangeRequestedAlimtalk(
      merchantUid
    );
    return await this.exchangeRequestsService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }
}
