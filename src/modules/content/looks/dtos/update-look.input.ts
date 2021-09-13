import { Field, InputType, Int, OmitType, PartialType } from '@nestjs/graphql';

import { CreateLookDigestInput, CreateLookInput } from './create-look.input';

@InputType()
export class UpdateLookDigestInput extends PartialType(CreateLookDigestInput) {
  @Field(() => Int, { nullable: true })
  id?: number;
}

@InputType()
export class UpdateLookInput extends PartialType(
  OmitType(CreateLookInput, ['digests'])
) {
  @Field(() => [UpdateLookDigestInput], { nullable: true })
  digests: UpdateLookDigestInput[];
}
