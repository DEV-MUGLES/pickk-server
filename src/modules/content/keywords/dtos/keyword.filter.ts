import { Field, InputType, Int } from '@nestjs/graphql';

import { IKeyword } from '../interfaces';

@InputType()
export class KeywordFilter implements Partial<IKeyword> {
  excludeFields: Array<keyof KeywordFilter> = [
    'keywordClassId',
    'isOwning',
    'isLiking',
  ];

  @Field({ nullable: true })
  isVisible: boolean;

  @Field(() => Int, { description: '제공시 추가 연산을 수행합니다.' })
  keywordClassId: number;
  @Field({
    description: '제공시 추가 연산을 수행합니다. (비로그인시 무시)',
    nullable: true,
  })
  isOwning: boolean;
  @Field({
    description: '제공시 추가 연산을 수행합니다. (비로그인시 무시)',
    nullable: true,
  })
  isLiking: boolean;

  get hasCustom() {
    return this.excludeFields.some((field) => this[field]);
  }
}
