import { Injectable, UseGuards } from '@nestjs/common';
import { Info, Args, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtVerifyGuard } from '@auth/guards';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import {
  OrderItemRelationType,
  ORDER_ITEM_RELATIONS,
} from '@order/order-items/constants';
import { OrderItemFilter } from '@order/order-items/dtos';
import { OrderItem } from '@order/order-items/models';
import { OrderItemsService } from '@order/order-items/order-items.service';
import { UserRole } from '@user/users/constants';

@Injectable()
export class RootOrderItemResolver extends BaseResolver<OrderItemRelationType> {
  relations = ORDER_ITEM_RELATIONS;

  constructor(private readonly orderItemsService: OrderItemsService) {
    super();
  }

  @Query(() => [OrderItem])
  @UseGuards(JwtVerifyGuard)
  @Roles(UserRole.Admin)
  async rootOrderItems(
    @Info() info?: GraphQLResolveInfo,
    @Args('orderItemFilter', { nullable: true })
    filter?: OrderItemFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<OrderItem[]> {
    return await this.orderItemsService.list(
      filter,
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }
}
