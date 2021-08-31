import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Coupon } from '@order/coupons/models';
import { OrderItem } from '@order/order-items/models';
import { RefundAccount, ShippingAddress, User } from '@user/users/models';

import { OrderStatus } from '../constants';

import { Order } from './order.model';

@ObjectType()
export class OrderSheetBrand {
  @Field()
  nameKor: string;

  @Field(() => Int)
  shippingFee: number;

  @Field(() => Int)
  totalItemFinalPrice: number;

  @Field(() => [OrderItem])
  items: OrderItem[];

  constructor(attributes?: Partial<OrderSheet>) {
    Object.assign(this, attributes);
  }
}

@ObjectType()
export class OrderSheet {
  @Field({
    description:
      'ApolloClient 최적화를 위한 필드입니다. order의 merchantUid와 같습니다.',
  })
  get id(): string {
    return this.order.merchantUid;
  }

  @Field(() => [OrderSheetBrand])
  get brands(): OrderSheetBrand[] {
    const brandItemsMap = new Map<number, OrderSheetBrand>();

    this.order.orderItems.forEach((orderItem) => {
      const { seller, brandNameKor } = orderItem;
      const { minimumAmountForFree, fee } = seller.shippingPolicy;

      if (!brandItemsMap.has(seller.id)) {
        brandItemsMap.set(seller.id, {
          nameKor: brandNameKor,
          shippingFee: fee,
          totalItemFinalPrice: 0,
          items: [],
        });
      }

      const orderSheetBrand = brandItemsMap.get(seller.id);
      orderSheetBrand.items.push(orderItem);
      orderSheetBrand.totalItemFinalPrice += orderItem.itemFinalPrice;

      if (orderSheetBrand.totalItemFinalPrice >= minimumAmountForFree) {
        orderSheetBrand.shippingFee = 0;
      }
    });

    return [...brandItemsMap.values()];
  }

  @Field(() => User)
  me: User;

  @Field(() => Order)
  order: Order;

  @Field(() => Int)
  availablePointAmount: number;

  @Field(() => [Coupon])
  coupons: Coupon[];

  @Field(() => [ShippingAddress])
  shippingAddresses: ShippingAddress[];

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
