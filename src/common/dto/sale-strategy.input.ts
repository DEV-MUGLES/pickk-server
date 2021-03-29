import { InputType, PickType } from '@nestjs/graphql';
import { SaleStrategy } from '../models/sale-strategy.model';

@InputType()
export class FindSaleStrategyInput extends PickType(
  SaleStrategy,
  ['canUseCoupon', 'canUseMileage'],
  InputType
) {}
