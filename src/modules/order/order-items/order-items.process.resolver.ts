import {
  ForbiddenException,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Args, Info, Mutation } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { JwtVerifyGuard } from '@auth/guards';
import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/models';
import { BaseResolver } from '@common/base.resolver';

import { OrderItemRelationType, ORDER_ITEM_RELATIONS } from './constants';
import { RequestOrderItemExchangeInput } from './dtos';
import { OrderItem } from './models';

import { OrderItemsService } from './order-items.service';

@Injectable()
export class OrderItemsProcessResolver extends BaseResolver<OrderItemRelationType> {
  relations = ORDER_ITEM_RELATIONS;

  constructor(
    @Inject(OrderItemsService)
    private readonly orderItemsService: OrderItemsService
  ) {
    super();
  }

  // @TODO: 완료 알림톡 전송.
  @Mutation(() => OrderItem)
  @UseGuards(JwtVerifyGuard)
  async requestOrderItemExchange(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('requestOrderItemExchangeInput')
    input: RequestOrderItemExchangeInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<OrderItem> {
    const isMine = await this.orderItemsService.checkBelongsTo(
      merchantUid,
      userId
    );
    if (!isMine) {
      throw new ForbiddenException('자신의 주문상품이 아닙니다.');
    }

    await this.orderItemsService.requestExchange(merchantUid, input);

    return await this.orderItemsService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }
}
