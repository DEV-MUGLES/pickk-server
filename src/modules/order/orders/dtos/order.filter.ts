import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

import { OrderStatus } from '../constants';
import { IOrder } from '../interfaces';

@InputType()
export class OrderFilter implements Partial<IOrder> {
  @Field(() => Int, {
    nullable: true,
  })
  @IsOptional()
  userId?: number;

  @Field(() => OrderStatus, {
    nullable: true,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @Field(() => String, { nullable: true })
  merchantUidLt?: string;
  @Field(() => [String], { nullable: true })
  merchantUidIn?: string[];
  @Field(() => [OrderStatus], {
    nullable: true,
  })
  @IsEnum(OrderStatus, { each: true })
  @IsOptional()
  statusIn?: OrderStatus[];
}
