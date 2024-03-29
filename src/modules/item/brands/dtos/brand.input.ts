import { InputType, PartialType, PickType } from '@nestjs/graphql';

import { Brand } from '../models';

@InputType()
export class CreateBrandInput extends PickType(
  Brand,
  ['nameKor', 'nameEng', 'description', 'imageUrl'],
  InputType
) {}

@InputType()
export class UpdateBrandInput extends PartialType(
  PickType(Brand, ['nameKor', 'nameEng', 'description', 'imageUrl'], InputType)
) {}
