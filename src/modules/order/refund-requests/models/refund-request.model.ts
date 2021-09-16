import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { OrderItem } from '@order/order-items/models';
import { Order } from '@order/orders/models';

import { RefundRequestStatus } from '../constants';
import { RefundRequestEntity } from '../entities';
import { RefundRequestMarkStrategyFactory } from '../factories';

@ObjectType()
export class RefundRequest extends RefundRequestEntity {
  @Field(() => Order)
  order: Order;
  @Type(() => OrderItem)
  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  /////////////////
  // 상태변경 함수들 //
  /////////////////

  private markAs(as: RefundRequestStatus) {
    RefundRequestMarkStrategyFactory.from(as, this).execute();
  }
  markPicked() {
    this.markAs(RefundRequestStatus.Picked);
  }
  /** orderItem의 상태도 변경된다. (join 필요) */
  markConfirmed() {
    this.markAs(RefundRequestStatus.Confirmed);
  }
}
