import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IDigest } from '@content/digests/interfaces';
import { IOrderItem } from '@order/order-items/interfaces';
import { IUser } from '@user/users/interfaces';

import { RewardSign } from '../constants';
import { IRewardEvent } from '../interfaces';

@ObjectType()
@Entity('reward_event')
@Index('idx-createdAt', ['userId', 'createdAt'])
export class RewardEventEntity extends BaseIdEntity implements IRewardEvent {
  constructor(attributes?: Partial<RewardEventEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.user = attributes.user;
    this.userId = attributes.userId;
    this.recommendDigest = attributes.recommendDigest;
    this.recommendDigestId = attributes.recommendDigestId;
    this.orderItem = attributes.orderItem;
    this.orderItemMerchantUid = attributes.orderItemMerchantUid;

    this.sign = attributes.sign;
    this.title = attributes.title;
    this.amount = attributes.amount;
    this.resultBalance = attributes.resultBalance;
  }

  @ManyToOne('UserEntity', { onDelete: 'RESTRICT' })
  @JoinColumn()
  user: IUser;
  @Field(() => Int)
  @Column()
  userId: number;
  @ManyToOne('DigestEntity', { onDelete: 'SET NULL', nullable: true })
  recommendDigest: IDigest;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  recommendDigestId: number;
  @ManyToOne('OrderItemEntity', { onDelete: 'RESTRICT' })
  @JoinColumn()
  orderItem: IOrderItem;
  @Field()
  @Column({ type: 'char', length: 22 })
  orderItemMerchantUid: string;

  @Field(() => RewardSign)
  @Column({ type: 'enum', enum: RewardSign })
  sign: RewardSign;
  @Field()
  @Column({ length: 30 })
  title: string;
  @Field(() => Int, { description: '양수/음수 구분함' })
  @Column({ type: 'int' })
  amount: number;
  @Field(() => Int, { description: '적립/사용 이후 잔고' })
  @Column({ type: 'int', unsigned: true })
  resultBalance: number;
}
