import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { Look } from '@content/looks/models';

import { KeywordLookEntity } from '../entities';

@ObjectType()
export class KeywordLook extends KeywordLookEntity {
  @Field(() => Look)
  @Type(() => Look)
  look: Look;
}
