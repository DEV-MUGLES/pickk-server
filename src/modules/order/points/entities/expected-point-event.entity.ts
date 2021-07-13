import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';

import { BaseIdEntity } from '@common/entities/base.entity';
import { UserEntity } from '@user/users/entities/user.entity';
import { User } from '@user/users/models';

import { IExpectedPointEvent } from '../interfaces/expected-point-event.interface';

@ObjectType()
@Entity('expected_point_event')
@Index('idx_createdAt', ['userId', 'createdAt'])
@Index('idx_orderId', ['orderId'])
export class ExpectedPointEventEntity
  extends BaseIdEntity
  implements IExpectedPointEvent
{
  constructor(attributes?: Partial<ExpectedPointEventEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.amount = attributes.amount;
    this.title = attributes.title;
    this.content = attributes.content;

    this.orderId = attributes.orderId;
    this.user = attributes.user;
    this.userId = attributes.userId;
  }

  @Field(() => Int, {
    description: '적립/사용 금액. 적립인 경우 양수, 사용인 경우 음수입니다.',
  })
  @Column({ type: 'int' })
  @IsNumber()
  amount: number;

  @Field()
  @Column({
    length: 30,
  })
  @IsString()
  title: string;

  @Field()
  @Column({
    length: 50,
  })
  @IsString()
  content: string;

  @Field()
  @Column({ type: 'int' })
  orderId: number;

  @Field()
  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
