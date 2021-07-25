import { Field, InputType, Int, OmitType, PickType } from '@nestjs/graphql';
import { OrderItem } from '@order/order-items/models';

import {
  Order,
  OrderBuyer,
  OrderReceiver,
  OrderRefundAccount,
} from '../models';

@InputType()
export class OrderBuyerInput extends OmitType(
  OrderBuyer,
  ['id', 'createdAt', 'updatedAt'],
  InputType
) {}

@InputType()
export class OrderReceiverInput extends OmitType(
  OrderReceiver,
  ['id', 'createdAt', 'updatedAt'],
  InputType
) {}

@InputType()
export class OrderRefundAccountInput extends OmitType(
  OrderRefundAccount,
  ['id', 'createdAt', 'updatedAt'],
  InputType
) {}

@InputType()
export class StartOrderItemInput extends PickType(
  OrderItem,
  ['merchantUid', 'usedCouponId'],
  InputType
) {}

@InputType()
export class StartOrderInput extends PickType(Order, ['payMethod'], InputType) {
  @Field(() => [StartOrderItemInput], { nullable: true })
  orderItemInputs?: StartOrderItemInput[];

  @Field(() => Int)
  usedPointAmount: number;

  @Field(() => OrderBuyerInput)
  buyerInput: OrderBuyerInput;

  @Field(() => OrderReceiverInput)
  receiverInput: OrderReceiverInput;

  @Field(() => OrderRefundAccountInput, { nullable: true })
  refundAccountInput?: OrderRefundAccountInput;
}
