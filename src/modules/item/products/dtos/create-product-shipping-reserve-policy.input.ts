import { InputType, PickType } from '@nestjs/graphql';

import { ProductShippingReservePolicy } from '../models';

@InputType()
export class CreateProductShippingReservePolicyInput extends PickType(
  ProductShippingReservePolicy,
  ['estimatedShippingBegginDate', 'stock'],
  InputType
) {}
