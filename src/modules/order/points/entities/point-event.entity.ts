import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';
import { UserEntity } from '@user/users/entities';
import { User } from '@user/users/models';

import { PointSign } from '../constants';
import { IPointEvent } from '../interfaces';

@ObjectType()
@Entity('point_event')
@Index('idx-createdAt', ['userId', 'createdAt'])
@Index('idx-orderItemMerchantUid', ['orderItemMerchantUid'])
export class PointEventEntity extends BaseIdEntity implements IPointEvent {
  constructor(attributes?: Partial<PointEventEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.title = attributes.title;
    this.sign = attributes.sign;
    this.amount = attributes.amount;
    this.resultBalance = attributes.resultBalance;

    this.orderItemMerchantUid = attributes.orderItemMerchantUid;
    this.user = attributes.user;
    this.userId = attributes.userId;
  }

  @Field()
  @Column({ length: 30 })
  title: string;
  @Field(() => PointSign)
  @Column({ type: 'enum', enum: PointSign })
  sign: PointSign;
  @Field(() => Int, { description: '적립/사용 금액. 양수/음수 구분함' })
  @Column({ type: 'int' })
  amount: number;
  @Field(() => Int, { description: '적립/사용 이후 잔고' })
  @Column({ type: 'int', unsigned: true })
  resultBalance: number;

  @Field({ nullable: true })
  @Column({ type: 'char', length: 22, nullable: true })
  orderItemMerchantUid: string;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
  @Field(() => Int)
  @Column()
  userId: number;
}
