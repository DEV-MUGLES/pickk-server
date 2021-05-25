import { Field, InputType } from '@nestjs/graphql';

import { IsPickkImageUrl } from '@src/common/decorators/validations/is-pickk-image-url';

@InputType()
export class CreateItemDetailImageInput {
  @Field(() => [String])
  @IsPickkImageUrl({ each: true })
  urls: string[];
}
