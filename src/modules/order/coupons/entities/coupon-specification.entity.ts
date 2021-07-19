import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { BaseIdEntity } from '@common/entities';
import { Brand } from '@src/modules/item/brands/models/brand.model';
import { BrandEntity } from '@src/modules/item/brands/entities/brand.entity';

import { CouponType } from '../constants/coupon.enum';
import { ICouponSpecification } from '../interfaces/coupon-specification.interface';

@ObjectType()
@Entity('coupon_specification')
export class CouponSpecificationEntity
  extends BaseIdEntity
  implements ICouponSpecification
{
  constructor(attributes?: Partial<CouponSpecificationEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.brand = attributes.brand;
    this.brandId = attributes.brandId;

    this.name = attributes.name;
    this.type = attributes.type;

    this.discountAmount = attributes.discountAmount;
    this.discountRate = attributes.discountRate;

    this.minimumForUse = attributes.minimumForUse;
    this.maximumDiscountPrice = attributes.maximumDiscountPrice;

    this.availableAt = attributes.availableAt;
    this.expireAt = attributes.expireAt;
  }

  @Field({
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  brandId?: number;

  @Field(() => Brand, {
    nullable: true,
  })
  @ManyToOne(() => BrandEntity, {
    nullable: true,
  })
  @JoinColumn()
  brand?: Brand;

  @Field({
    description: '최대 30자까지 입력할 수 있습니다.',
  })
  @Column({
    length: 30,
  })
  @IsString()
  @MaxLength(30)
  name: string;

  @Field(() => CouponType)
  @Column({
    type: 'enum',
    enum: CouponType,
  })
  @IsEnum(CouponType)
  type: CouponType;

  @Field(() => Int, {
    nullable: true,
    description: '1~99 정수만 입력 가능합니다.',
  })
  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  @IsInt()
  @Min(1)
  @Max(99)
  @IsOptional()
  discountRate?: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'mediumint', nullable: true, unsigned: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  discountAmount?: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'mediumint', nullable: true, unsigned: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  minimumForUse?: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'mediumint', nullable: true, unsigned: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  maximumDiscountPrice?: number;

  @Field({
    nullable: true,
    description: '이 값으로 클라이언트에서 필터링 해주세요.',
  })
  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  availableAt?: Date;

  @Field()
  @Column()
  @IsDate()
  expireAt: Date;
}
