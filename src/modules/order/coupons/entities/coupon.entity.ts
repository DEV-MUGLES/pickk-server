import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsEnum } from 'class-validator';

import { BaseIdEntity } from '@common/entities';
import { IUser } from '@user/users/interfaces';

import { CouponStatus } from '../constants';
import { ICoupon, ICouponSpecification } from '../interfaces';

@ObjectType()
@Entity('coupon')
export class CouponEntity extends BaseIdEntity implements ICoupon {
  constructor(attributes?: Partial<CouponEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.user = attributes.user;
    this.userId = attributes.userId;
    this.spec = attributes.spec;
    this.specId = attributes.specId;

    this.status = attributes.status;
  }

  @ManyToOne('UserEntity', { onDelete: 'CASCADE' })
  @JoinColumn()
  user: IUser;
  @Field(() => Int)
  @Column()
  userId: number;
  @ManyToOne('CouponSpecificationEntity', { onDelete: 'CASCADE' })
  @JoinColumn()
  spec: ICouponSpecification;
  @Field(() => Int)
  @Column()
  specId: number;

  @Field(() => CouponStatus, { nullable: true })
  @Column({ type: 'enum', enum: CouponStatus, default: CouponStatus.Ready })
  @IsEnum(CouponStatus)
  status: CouponStatus;
}
