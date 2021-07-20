import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsNumber } from 'class-validator';

import { getRandomUuid } from '@common/helpers';
import { PayMethod } from '@order/orders/constants';

import { OrderSheetInput } from '../dtos';

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
      uuid: getRandomUuid(),
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
