import { Field, InputType } from '@nestjs/graphql';

import { OrderItemSettleStatus } from '../constants';
import { IOrderItem } from '../interfaces';

@InputType()
export class BulkUpdateOrderItemInput implements Partial<IOrderItem> {
  @Field(() => OrderItemSettleStatus, { nullable: true })
  settleStatus?: OrderItemSettleStatus;

  settledAt?: Date;
}
