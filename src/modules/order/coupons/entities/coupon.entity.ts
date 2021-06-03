import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsEnum, IsOptional } from 'class-validator';

import { BaseIdEntity } from '@src/common/entities/base.entity';

import { ICoupon } from '../interfaces/coupon.interface';
import { CouponStatus } from '../constants/coupon.enum';
import { CouponSpecification } from '../models/coupon-specification.model';
import { CouponSpecificationEntity } from './coupon-specification.entity';
import { User } from '@src/modules/user/users/models/user.model';
import { UserEntity } from '@src/modules/user/users/entities/user.entity';

@ObjectType()
@Entity('coupon')
export class CouponEntity extends BaseIdEntity implements ICoupon {
  @Field()
  @Column()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Field()
  @Column()
  specId: number;

  @Field(() => CouponSpecification)
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
