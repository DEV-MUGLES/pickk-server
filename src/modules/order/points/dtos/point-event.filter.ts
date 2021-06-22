import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { PointType } from '../constants/points.enum';

import { IPointEvent } from '../interfaces/point-event.interface';

@InputType()
export class PointEventFilter implements Partial<IPointEvent> {
  @Field({ nullable: true })
  createdAtMte?: Date;

  @Field({ nullable: true })
  createdAtLte?: Date;

  @Field(() => PointType, { nullable: true })
  @IsEnum(PointType)
  @IsOptional()
  type?: PointType;

  @Field(() => Int, {
    nullable: true,
  })
  userId?: number;
}
