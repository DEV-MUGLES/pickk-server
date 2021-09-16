import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';
import { UserEntity } from '@user/users/entities';
import { User } from '@user/users/models';

import { IExpectedPointEvent } from '../interfaces';

@ObjectType()
@Entity('expected_point_event')
@Index('idx-createdAt', ['userId', 'createdAt'])
@Index('idx-orderItemMerchantUid', ['orderItemMerchantUid'])
export class ExpectedPointEventEntity
  extends BaseIdEntity
  implements IExpectedPointEvent
{
  constructor(attributes?: Partial<ExpectedPointEventEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.title = attributes.title;
    this.content = attributes.content;
    this.amount = attributes.amount;

    this.orderItemMerchantUid = attributes.orderItemMerchantUid;
    this.user = attributes.user;
    this.userId = attributes.userId;
  }

  @Field()
  @Column({ length: 30 })
  title: string;
  @Field()
  @Column({ length: 30 })
  content: string;
  @Field(() => Int, { description: '적립/사용 금액. 양수/음수 구분함' })
  @Column({ type: 'int' })
  amount: number;

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
