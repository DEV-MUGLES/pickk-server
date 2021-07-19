import { InputType, PickType } from '@nestjs/graphql';

import { Product } from '../models';

@InputType()
export class UpdateProductInput extends PickType(
  Product,
  ['stock'],
  InputType
) {}
