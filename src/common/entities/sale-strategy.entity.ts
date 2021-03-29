import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@src/common/entities/base.entity';

import { ISaleStrategy } from '../interfaces/sale-strategy.interface';

@ObjectType()
@Entity('sale_strategy')
export class SaleStrategyEntity extends BaseEntity implements ISaleStrategy {
  @Field()
  @Column()
  canUseCoupon: boolean;

  @Field()
  @Column()
  canUseMileage: boolean;
}
