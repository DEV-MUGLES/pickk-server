import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractAccountEntity } from '@common/entities';

import {
  ISellerSettleAccount,
  ISellerSettlePolicy,
} from '../../interfaces/policies';

@ObjectType()
@Entity('seller_settle_account')
export class SellerSettleAccountEntity
  extends AbstractAccountEntity
  implements ISellerSettleAccount
{
  @OneToOne('SellerSettlePolicyEntity', 'account', { onDelete: 'CASCADE' })
  @JoinColumn()
  settlePolicy: ISellerSettlePolicy;
  @Field(() => Int)
  @Column()
  settlePolicyId: number;
}
