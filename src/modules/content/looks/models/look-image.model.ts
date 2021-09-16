import { Field, ObjectType } from '@nestjs/graphql';

import { LookImageEntity } from '../entities';

import { Look } from './look.model';

@ObjectType()
export class LookImage extends LookImageEntity {
  @Field(() => Look)
  look: Look;
}
