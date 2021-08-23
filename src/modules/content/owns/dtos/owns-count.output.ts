import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '키워드 보유중 여부와 관련된 개수들입니다.' })
export class OwnsCountOutput {
  static create(
    userId: number,
    keywordClassId: number,
    total: number,
    owning: number
  ): OwnsCountOutput {
    return new OwnsCountOutput({
      id: `user:${userId}:keywordClassId:${keywordClassId}`,
      total,
      owning,
    });
  }

  constructor(attributes?: Partial<OwnsCountOutput>) {
    if (!attributes) {
      return;
    }

    this.id = attributes.id;

    this.total = attributes.total;
    this.owning = attributes.owning;
  }

  @Field({
    description: "'`user:<userId>:keywordClassId:<keywordClassId>`와 동일",
  })
  id: string;

  @Field(() => Int, { description: '해당 클래스의 키워드 수' })
  total: number;
  @Field(() => Int, { description: '해당 클래스의 키워드 중 내가 보유한 수' })
  owning: number;
}
