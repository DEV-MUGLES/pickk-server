import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

import { IItemProperty } from '../interfaces';

@InputType()
export class ItemPropertyFilter implements Partial<IItemProperty> {
  @Field(() => Int, {
    nullable: true,
  })
  @IsOptional()
  minorCategoryId?: number;
}
