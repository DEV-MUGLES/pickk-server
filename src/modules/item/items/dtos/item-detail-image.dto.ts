import { Field, InputType } from '@nestjs/graphql';

import { IsPickkImageUrl } from '@common/decorators';

@InputType()
export class CreateItemDetailImageInput {
  @Field(() => [String])
  @IsPickkImageUrl({ each: true })
  urls: string[];
}
