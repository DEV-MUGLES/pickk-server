import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Coupon } from '@order/coupons/models';
import { RefundAccount, ShippingAddress, User } from '@user/users/models';

import { OrderStatus } from '../constants';
import { getOrderBrands } from '../helpers';

import { OrderBrand } from './order-brand.model';
import { Order } from './order.model';

@ObjectType()
export class OrderSheet {
  @Field({ description: '[MODEL ONLY] order의 merchantUid와 같습니다.' })
  get id(): string {
    return this.order.merchantUid;
  }
  @Field(() => [OrderBrand])
  get brands(): OrderBrand[] {
    return getOrderBrands(this.order.orderItems);
  }

  @Field(() => User)
  me: User;
  @Field(() => [ShippingAddress])
  shippingAddresses: ShippingAddress[];

  @Field(() => Order)
  order: Order;

  @Field(() => Int)
  availablePointAmount: number;
  @Field(() => [Coupon])
  coupons: Coupon[];
  @Field(() => RefundAccount, { nullable: true })
  refundAccount: RefundAccount;

  constructor(attributes?: Partial<OrderSheet>) {
    Object.assign(this, attributes);
  }

  static from(
    order: Order,
    user: User,
    availablePointAmount: number,
    coupons: Coupon[]
  ): OrderSheet {
    if (order.userId !== user.id) {
      throw new ForbiddenException('본인의 주문건이 아닙니다.');
    }
    if (order.status === OrderStatus.Paid) {
      throw new BadRequestException('이미 결제된 주문건입니다.');
    }

    return new OrderSheet({
      me: user,
      order,
      availablePointAmount,
      coupons,
    });
  }
}
