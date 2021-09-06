import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateDigestImageInput {
  @Field(() => [String])
  urls: string[];
}
