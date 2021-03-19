import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { Brand } from '../models/brand.model';

@InputType()
export class CreateBrandInput extends PickType(
  Brand,
  ['nameKor', 'nameEng', 'description'],
  InputType
) {}

@InputType()
export class UpdateBrandInput extends PartialType(
  PickType(Brand, ['nameKor', 'nameEng', 'description'], InputType)
) {}
