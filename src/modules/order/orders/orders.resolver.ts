import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { PageInput } from '@common/dtos';
import { BaseResolver, DerivedFieldsInfoType } from '@common/base.resolver';

import { OrderRelationType, OrderStatus, ORDER_RELATIONS } from './constants';
import { Order } from './models';

import { OrdersService } from './orders.service';

@Injectable()
export class OrdersResolver extends BaseResolver<OrderRelationType> {
  relations = ORDER_RELATIONS;
  derivedFieldsInfo: DerivedFieldsInfoType = {
    orderItems: ['brands'],
    'orderItems.item': ['brands'],
    'orderItems.seller': ['brands'],
    'orderItems.seller.brand': ['brands'],
    'orderItems.seller.shippingPolicy': ['brands'],
  };

  constructor(private readonly ordersService: OrdersService) {
    super();
  }

  @Query(() => Order)
  @UseGuards(JwtVerifyGuard)
  async meOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Order> {
    await this.ordersService.checkBelongsTo(merchantUid, userId);

    return await this.ordersService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => [Order], { description: 'VbankReady, VbankDodged, Paid만 표시' })
  @UseGuards(JwtVerifyGuard)
  async meOrders(
    @CurrentUser() payload: JwtPayload,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Order[]> {
    return await this.ordersService.list(
      {
        userId: payload.sub,
        statusIn: [
          OrderStatus.VbankReady,
          OrderStatus.VbankDodged,
          OrderStatus.Paid,
        ],
      },
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }
}
