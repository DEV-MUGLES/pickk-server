import { Field, InputType, Int } from '@nestjs/graphql';
import { LessThan } from 'typeorm';

@InputType()
export class PageInput {
  @Field(() => Int, { nullable: true })
  startId?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;

  @Field(() => Int, { defaultValue: 20 })
  limit?: number;

  get idFilter() {
    if (!this.startId) {
      return {};
    }
    return { id: LessThan(this.startId) };
  }

  get pageFilter() {
    if (this.offset === undefined) {
      return {};
    }
    return {
      skip: this.offset,
      take: this.limit,
    };
  }
}
