import { Field, InputType, Int, OmitType, PartialType } from '@nestjs/graphql';
import { CreateVideoInput } from '.';

import { CreateVideoDigestInput } from './create-video.input';

@InputType()
export class UpdateVideoDigestInput extends PartialType(
  CreateVideoDigestInput
) {
  @Field(() => Int, { nullable: true })
  id?: number;
}

@InputType()
export class UpdateVideoInput extends PartialType(
  OmitType(CreateVideoInput, ['digests'])
) {
  @Field(() => [UpdateVideoDigestInput], { nullable: true })
  digests: UpdateVideoDigestInput[];
}
