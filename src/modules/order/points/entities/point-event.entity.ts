import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { BaseIdEntity } from '@common/entities';
import { UserEntity } from '@user/users/entities';
import { User } from '@user/users/models';

import { IPointEvent } from '../interfaces/point-event.interface';
import { PointType } from '../constants/points.enum';

@ObjectType()
@Entity('point_event')
@Index('idx_createdAt', ['userId', 'createdAt'])
@Index('idx_orderId', ['orderId'])
export class PointEventEntity extends BaseIdEntity implements IPointEvent {
  constructor(attributes?: Partial<PointEventEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.type = attributes.type;
    this.amount = attributes.amount;
    this.resultBalance = attributes.resultBalance;
    this.title = attributes.title;
    this.content = attributes.content;

    this.orderId = attributes.orderId;
    this.orderItemId = attributes.orderItemId;
    this.user = attributes.user;
    this.userId = attributes.userId;
  }

  @Field(() => PointType)
  @Column({
    type: 'enum',
    enum: PointType,
  })
  @IsEnum(PointType)
  type: PointType;

  @Field(() => Int, {
    description: '적립/사용 금액. 적립인 경우 양수, 사용인 경우 음수입니다.',
  })
  @Column({ type: 'int' })
  @IsNumber()
  amount: number;

  @Field(() => Int, { description: '적립/사용 이후 잔고' })
  @Column({ type: 'int' })
  @IsNumber()
  @Min(1)
  resultBalance: number;

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

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  @IsOptional()
  orderId?: number;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  @IsOptional()
  orderItemId?: number;

  @Field()
  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
