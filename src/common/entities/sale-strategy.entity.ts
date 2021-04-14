import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

import { BaseIdEntity } from '@src/common/entities/base.entity';

import { ISaleStrategy } from '../interfaces/sale-strategy.interface';

@ObjectType()
@Entity('sale_strategy')
export class SaleStrategyEntity extends BaseIdEntity implements ISaleStrategy {
  @Field()
  @Column()
  canUseCoupon: boolean;

  @Field()
  @Column()
  canUseMileage: boolean;
}
