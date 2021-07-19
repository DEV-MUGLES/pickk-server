import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsDate, IsNumber } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { IProductShippingReservePolicy } from '../interfaces';

@ObjectType()
@Entity({
  name: 'product_shipping_reserve_policy',
})
export class ProductShippingReservePolicyEntity
  extends BaseIdEntity
  implements IProductShippingReservePolicy
{
  constructor(attributes?: Partial<ProductShippingReservePolicyEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.estimatedShippingBegginDate = attributes.estimatedShippingBegginDate;
    this.stock = attributes.stock;
  }

  @Field({ description: '예약발송 예정일' })
  @Column('datetime')
  @IsDate()
  estimatedShippingBegginDate: Date;

  @Field(() => Int, {
    description:
      '예약설정된 재고. 예약발송일이 되면, 예약발송 상태는 자동으로 종료되며, 잔여 예약발송 재고는 일반 재고에 합산됩니다.',
  })
  @Column({ type: 'smallint', unsigned: true })
  @IsNumber()
  stock: number;
}
