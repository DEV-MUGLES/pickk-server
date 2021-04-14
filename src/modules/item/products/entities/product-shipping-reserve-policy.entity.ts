import { Field, ObjectType } from '@nestjs/graphql';
import { BaseIdEntity } from '@src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { IProductShippingReservePolicy } from '../interfaces/product-shipping-reserve-policy.interface';

@ObjectType()
@Entity({
  name: 'product_shipping_reserve_policy',
})
export class ProductShippingReservePolicyEntity
  extends BaseIdEntity
  implements IProductShippingReservePolicy {
  @Field()
  @Column('datetime')
  estimatedShippingBegginDate: Date;

  @Field()
  @Column('datetime')
  startAt: Date;

  @Field()
  @Column('datetime')
  endAt: Date;
}
