import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsNumber } from 'class-validator';

import { PayMethod } from '@order/orders/constants/order.enum';

import { OrderSheetInput } from '../dtos';
import { randomUUID } from 'crypto';

@ObjectType()
export class OrderSheetProductData {
  @Field(() => Int)
  @IsNumber()
  productId: number;

  @Field(() => Int)
  @IsNumber()
  quantity: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  couponId?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  recommenderId?: number;
}

@ObjectType()
export class OrderSheet {
  @Field(() => Int)
  id: number;

  @Field()
  uuid: string;

  @Field(() => Int)
  userId: number;

  @Field(() => [OrderSheetProductData])
  productDatas: OrderSheetProductData[];

  @Field(() => Int)
  @IsNumber()
  shippingAddressId: number;

  @Field(() => Int)
  @IsNumber()
  usedPointAmount: number;

  @Field(() => PayMethod)
  @IsEnum(PayMethod)
  payMethod: PayMethod;

  public static getCacheKey(userId: number): string {
    return `os:${userId}`;
  }

  public static from(userId: number, input: OrderSheetInput): OrderSheet {
    return new OrderSheet({
      uuid: randomUUID(),
      id: userId,
      userId,
      ...input,
      productDatas: input.productInputs,
    });
  }

  constructor(attributes?: Partial<OrderSheet>) {
    if (attributes) {
      Object.assign(this, attributes);
    }
  }
}
