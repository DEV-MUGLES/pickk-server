import { InputType, PickType } from '@nestjs/graphql';

import { SaleStrategy } from '../models';

@InputType()
export class FindSaleStrategyInput extends PickType(
  SaleStrategy,
  ['canUseCoupon', 'canUseMileage'],
  InputType
) {}
