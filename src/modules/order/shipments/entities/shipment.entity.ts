import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEnum, IsOptional, MaxLength } from 'class-validator';

import { Courier } from '@item/couriers/models';

import { ShipmentOwnerType, ShipmentStatus } from '../constants';
import { IShipment } from '../interfaces';

@ObjectType()
@Entity('shipment')
@Index('idx_status', ['status'])
export class ShipmentEntity implements IShipment {
  constructor(attributes?: Partial<ShipmentEntity>) {
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;

    this.status = attributes.status;
    this.ownerType = attributes.ownerType;
    this.ownerId = attributes.ownerId;

    this.courier = attributes.courier;
    this.courierId = attributes.courierId;
    this.trackCode = attributes.trackCode;

    this.lastTrackedAt = attributes.lastTrackedAt;
  }
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  //

  @Field(() => ShipmentStatus)
  @Column({
    type: 'enum',
    enum: ShipmentStatus,
  })
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;

  @Field(() => ShipmentOwnerType, { nullable: true })
  @Column({
    type: 'enum',
    enum: ShipmentOwnerType,
    nullable: true,
  })
  @IsEnum(ShipmentOwnerType)
  @IsOptional()
  ownerType: ShipmentOwnerType;

  @Field(() => Int, {
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  ownerId: number;

  // 배송 정보

  @Field(() => Courier, { nullable: true })
  @ManyToOne('CourierEntity', { nullable: true })
  courier: Courier;

  @Field(() => Int, {
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  courierId: number;

  @Field({
    nullable: true,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    length: 30,
  })
  @MaxLength(30)
  trackCode: string;

  // Dates

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastTrackedAt: Date;
}
