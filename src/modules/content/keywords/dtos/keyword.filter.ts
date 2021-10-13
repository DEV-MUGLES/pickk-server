import { Field, InputType, Int } from '@nestjs/graphql';

import { IKeyword } from '../interfaces';

@InputType()
export class KeywordFilter implements Partial<IKeyword> {
  excludeFields?: Array<keyof KeywordFilter> = [
    'keywordClassId',
    'keywordClassIdIn',
    'isOwning',
    'isLiking',
    'hasCustom',
    'orderBy',
  ];

  @Field({ nullable: true })
  isVisible?: boolean;
  @Field(() => [Int], { nullable: true })
  idIn?: number[];

  @Field(() => Int, { description: '[CUSTOM]', nullable: true })
  keywordClassId?: number;
  @Field(() => [Int], { description: '[CUSTOM]', nullable: true })
  keywordClassIdIn?: number[];
  @Field({ description: '[CUSTOM]', nullable: true })
  isOwning?: boolean;
  @Field({ description: '[CUSTOM]', nullable: true })
  isLiking?: boolean;

  get hasCustom() {
    return (
      this.keywordClassId != null ||
      this.keywordClassIdIn != null ||
      this.isLiking != null ||
      this.isOwning != null
    );
  }

  @Field(() => String, { description: '기본값 id', nullable: true })
  orderBy?: keyof IKeyword;
}
