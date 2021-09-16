import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractAccountEntity } from '@common/entities';

import {
  ISellerClaimPolicy,
  ISellerSettleAccount,
} from '../../interfaces/policies';

@ObjectType()
@Entity('seller_settle_account')
export class SellerSettleAccountEntity
  extends AbstractAccountEntity
  implements ISellerSettleAccount
{
  @OneToOne('SellerClaimPolicyEntity', 'account', { onDelete: 'CASCADE' })
  @JoinColumn()
  claimPolicy: ISellerClaimPolicy;
  @Field(() => Int)
  @Column()
  claimPolicyId: number;
}
