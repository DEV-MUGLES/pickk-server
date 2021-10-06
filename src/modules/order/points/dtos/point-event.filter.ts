import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

import { PointSign } from '../constants';
import { IPointEvent } from '../interfaces';

@InputType()
export class PointEventFilter implements Partial<IPointEvent> {
  @Field({ nullable: true })
  createdAtMte?: Date;

  @Field({ nullable: true })
  createdAtLte?: Date;

  @Field(() => PointSign, { nullable: true })
  @IsEnum(PointSign)
  @IsOptional()
  sign?: PointSign;

  @Field(() => Int, {
    nullable: true,
  })
  userId?: number;
}
