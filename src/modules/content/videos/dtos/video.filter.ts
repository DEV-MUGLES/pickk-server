import { Field, InputType, Int } from '@nestjs/graphql';

import { IVideo } from '../interfaces';

@InputType()
export class VideoFilter implements Partial<IVideo> {
  @Field(() => Int, { nullable: true })
  userId: number;
}
