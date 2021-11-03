import { InputType, PartialType } from '@nestjs/graphql';

import { CreateItemsExhibitionInput } from './create-items-exhibition.input';

@InputType()
export class UpdateItemsExhibitionInput extends PartialType(
  CreateItemsExhibitionInput
) {}
