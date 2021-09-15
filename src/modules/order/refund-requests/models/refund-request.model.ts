import { BadRequestException } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

import { OrderItem } from '@order/order-items/models';
import { Order } from '@order/orders/models';
import { RefundRequestStatus } from '../constants';

import { RefundRequestEntity } from '../entities';

@ObjectType()
export class RefundRequest extends RefundRequestEntity {
  @Field(() => Order)
  order: Order;
  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  markPicked() {
    if (this.status !== RefundRequestStatus.Requested) {
      throw new BadRequestException(
        `반품요청${this.merchantUid}가 요청됨 상태가 아닙니다.`
      );
    }

    this.status = RefundRequestStatus.Picked;
    this.pickedAt = new Date();
  }
}
