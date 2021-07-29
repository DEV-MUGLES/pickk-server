import {
  ForbiddenException,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { BaseResolver } from '@common/base.resolver';

import { OrderRelationType, ORDER_RELATIONS } from './constants';
import { BaseOrderOutput } from './dtos';

import { OrdersService } from './orders.service';

@Injectable()
export class OrdersProcessResolver extends BaseResolver<OrderRelationType> {
  relations = ORDER_RELATIONS;

  constructor(
    @Inject(OrdersService)
    private readonly ordersService: OrdersService
  ) {
    super();
  }

  // @TODO: SQS에서 1. 재고복구, 2. Payment 채번취소 처리, 3. 완료 알림톡 전송
  @Mutation(() => BaseOrderOutput)
  @UseGuards(JwtVerifyGuard)
  async dodgeVbankOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string
  ) {
    const order = await this.ordersService.get(merchantUid, ['orderItems']);
    if (order.userId !== userId) {
      throw new ForbiddenException('자신의 주문이 아닙니다.');
    }

    return await this.ordersService.dodgeVbank(order);
  }
}
