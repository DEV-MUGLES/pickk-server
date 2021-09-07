import { Field, InputType } from '@nestjs/graphql';

import { KeywordClassType } from '../constants';
import { IKeywordClass } from '../interfaces';

@InputType()
export class KeywordClassFilter implements Partial<IKeywordClass> {
  @Field({ nullable: true })
  isVisible?: boolean;
  @Field(() => KeywordClassType, { nullable: true })
  type?: KeywordClassType;
}
