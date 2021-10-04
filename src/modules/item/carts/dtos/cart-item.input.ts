import { InputType, PickType } from '@nestjs/graphql';

import { CartItem } from '../models';

@InputType()
export class CreateCartItemInput extends PickType(
  CartItem,
  ['quantity', 'productId', 'recommendDigestId'],
  InputType
) {}

@InputType()
export class UpdateCartItemInput extends PickType(
  CartItem,
  ['quantity'],
  InputType
) {}
