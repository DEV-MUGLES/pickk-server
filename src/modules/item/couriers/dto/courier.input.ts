import { InputType, PartialType, PickType } from '@nestjs/graphql';

import { Courier } from '../models/courier.model';

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
