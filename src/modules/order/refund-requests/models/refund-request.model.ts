import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { OrderItemClaimStatus } from '@order/order-items/constants';
import { OrderItem } from '@order/order-items/models';
import { calcClaimAmount, calcClaimShippingFee } from '@order/orders/helpers';
import { Order } from '@order/orders/models';

import { RefundRequestStatus } from '../constants';
import { RefundRequestEntity } from '../entities';
import { RefundRequestMarkStrategyFactory } from '../factories';

@ObjectType()
export class RefundRequest extends RefundRequestEntity {
  @Field({ description: '[MODEL ONLY]' })
  get id(): string {
    return this.merchantUid;
  }

  @Field(() => Order)
  @Type(() => Order)
  order: Order;
  @Field(() => [OrderItem])
  @Type(() => OrderItem)
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
  /** mark as: confirmed. orderItems의 상태도 변경된다. (join 필요)
   * @param {number} shippingFee 부과된 배송비를 변경하며 승인하고 싶을 때 넘겨주세용 */
  confirm(shippingFee?: number) {
    this.markAs(RefundRequestStatus.Confirmed);
    if (shippingFee != null) {
      this.shippingFee = shippingFee;
    }
  }

  convert(orderItemMerchantUid: string) {
    for (const oi of this.orderItems) {
      if (oi.merchantUid !== orderItemMerchantUid) {
        continue;
      }

      oi.refundRequest = null;
      oi.claimStatus = null;
    }

    const remainOrderItems = this.orderItems.filter(
      (v) => v.claimStatus === OrderItemClaimStatus.RefundRequested
    );
    this.shippingFee = calcClaimShippingFee(remainOrderItems, this.faultOf);
    this.amount = calcClaimAmount(remainOrderItems);
  }
}
