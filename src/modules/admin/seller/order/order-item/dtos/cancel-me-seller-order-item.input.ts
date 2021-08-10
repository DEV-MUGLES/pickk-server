import { InputType, OmitType } from '@nestjs/graphql';

import { CancelOrderInput } from '@order/orders/dtos';

@InputType()
export class CancelMeSellerOrderItemInput extends OmitType(CancelOrderInput, [
  'orderItemMerchantUids',
]) {}
