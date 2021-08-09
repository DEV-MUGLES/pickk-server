import { Field, InputType, PickType } from '@nestjs/graphql';

import { ExchangeRequest } from '@order/exchange-requests/models';
import { CreateShipmentInput } from '@order/shipments/dtos';

@InputType()
export class RequestOrderItemExchangeInput extends PickType(
  ExchangeRequest,
  ['reason', 'shippingFee', 'faultOf', 'productId'],
  InputType
) {
  @Field(() => CreateShipmentInput, { nullable: true })
  shipmentInput: CreateShipmentInput;
}
