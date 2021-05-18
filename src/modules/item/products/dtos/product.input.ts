import { InputType, PickType } from '@nestjs/graphql';
import { Product } from '../models/product.model';

@InputType()
export class UpdateProductInput extends PickType(
  Product,
  ['stock'],
  InputType
) {}
