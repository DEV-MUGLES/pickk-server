import { InputType, PickType } from '@nestjs/graphql';

import { CartItem } from '../models';

@InputType()
export class CreateCartItemInput extends PickType(
  CartItem,
  ['quantity', 'productId'],
  InputType
) {}

@InputType()
export class UpdateCartItemInput extends PickType(
  CartItem,
  ['quantity'],
  InputType
) {}
