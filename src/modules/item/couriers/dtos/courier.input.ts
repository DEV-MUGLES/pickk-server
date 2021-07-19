import { InputType, PartialType, PickType } from '@nestjs/graphql';

import { Courier } from '../models';

@InputType()
export class CreateCourierInput extends PickType(
  Courier,
  ['name', 'code', 'phoneNumber', 'returnReserveUrl'],
  InputType
) {}

@InputType()
export class UpdateCourierInput extends PartialType(
  PickType(
    Courier,
    ['name', 'code', 'phoneNumber', 'returnReserveUrl'],
    InputType
  )
) {}
