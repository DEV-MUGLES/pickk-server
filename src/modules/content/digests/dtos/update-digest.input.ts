import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

import { ItemPropertyValue } from '@item/item-properties/models';

import { CreateDigestInput } from './create-digest.input';
import { UpdateDigestImageInput } from './update-digest-image.input';

@InputType()
export class UpdateDigestInput extends PartialType(
  CreateDigestInput,
  InputType
) {
  @Field(() => Int)
  id: number;

  @Field(() => UpdateDigestImageInput)
  imageInput: UpdateDigestImageInput;

  itemPropertyValues: ItemPropertyValue[];
}
