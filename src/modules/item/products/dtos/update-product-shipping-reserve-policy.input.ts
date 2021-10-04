import { InputType, PartialType } from '@nestjs/graphql';

import { CreateProductShippingReservePolicyInput } from './create-product-shipping-reserve-policy.input';

@InputType()
export class UpdateProductShippingReservePolicyInput extends PartialType(
  CreateProductShippingReservePolicyInput
) {}
