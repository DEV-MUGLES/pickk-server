import { Field, InputType } from '@nestjs/graphql';

import { ShipOrderItemInput } from '@order/order-items/dtos';

@InputType()
export class ExtendedShipOrderItemInput extends ShipOrderItemInput {
  @Field()
  merchantUid: string;
}

@InputType()
export class BulkShipOrderItemInput {
  @Field(() => [ExtendedShipOrderItemInput])
  shipOrderItemInputs: ExtendedShipOrderItemInput[];
}
