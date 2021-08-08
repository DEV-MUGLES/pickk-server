import { InputType, PickType } from '@nestjs/graphql';

import { ExchangeRequest } from '@order/exchange-requests/models';

@InputType()
export class RequestOrderItemExchangeInput extends PickType(
  ExchangeRequest,
  ['reason', 'shippingFee', 'faultOf', 'productId'],
  InputType
) {}
