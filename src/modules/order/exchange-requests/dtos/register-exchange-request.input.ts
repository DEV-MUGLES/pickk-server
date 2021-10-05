import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsString } from 'class-validator';

import { OrderClaimFaultOf } from '@order/refund-requests/constants';
import { CreateShipmentInput } from '@order/shipments/dtos';

@InputType()
export class RegisterExchangeRequestInput {
  @Field({ description: '255자 이내로 적어주세요' })
  @IsString()
  reason: string;

  @Field(() => OrderClaimFaultOf)
  @IsEnum(OrderClaimFaultOf)
  faultOf: OrderClaimFaultOf;

  @Field(() => Int, { description: '교환 대상 product' })
  @IsNumber()
  productId: number;

  @Field(() => CreateShipmentInput, { nullable: true })
  shipmentInput: CreateShipmentInput;
}
