import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsEnum, IsOptional } from 'class-validator';

import { BaseIdEntity } from '@common/entities';
import { UserEntity } from '@user/users/entities';
import { User } from '@user/users/models';

import { ICoupon } from '../interfaces/coupon.interface';
import { CouponStatus } from '../constants/coupon.enum';
import { CouponSpecification } from '../models/coupon-specification.model';
import { CouponSpecificationEntity } from './coupon-specification.entity';

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

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Field()
  @Column()
  specId: number;

  @Field(() => CouponSpecification, { nullable: true })
  @ManyToOne(() => CouponSpecificationEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  spec: CouponSpecification;

  @Field(() => CouponStatus, { nullable: true })
  @Column({
    type: 'enum',
    enum: CouponStatus,
    default: CouponStatus.Ready,
  })
  @IsEnum(CouponStatus)
  @IsOptional()
  status: CouponStatus;
}
