import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEnum, IsOptional, MaxLength } from 'class-validator';

import { Courier } from '@item/couriers/models';

import { ShipmentOwnerType, ShipmentStatus } from '../constants';
import { IShipment } from '../interfaces';
import { ShipmentHistory } from '../models';

@ObjectType()
@Entity('shipment')
@Index('idx-status', ['status'])
export class ShipmentEntity extends BaseEntity implements IShipment {
  constructor(attributes?: Partial<ShipmentEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;

    this.histories = attributes.histories;

    this.status = attributes.status;
    this.ownerType = attributes.ownerType;
    this.ownerPk = attributes.ownerPk;

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

  @OneToMany('ShipmentHistoryEntity', 'shipment', { cascade: true })
  histories: ShipmentHistory[];

  @Field(() => ShipmentStatus)
  @Column({ type: 'enum', enum: ShipmentStatus })
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;
  @Field(() => ShipmentOwnerType, { nullable: true })
  @Column({ type: 'enum', enum: ShipmentOwnerType, nullable: true })
  @IsEnum(ShipmentOwnerType)
  @IsOptional()
  ownerType: ShipmentOwnerType;
  @Field({ nullable: true })
  @Column({ nullable: true, length: 30 })
  ownerPk: string;

  // 배송 정보

  @Field(() => Courier)
  @ManyToOne('CourierEntity', { onDelete: 'RESTRICT' })
  courier: Courier;
  @Field(() => Int)
  @Column()
  courierId: number;
  @Field()
  @Column({ length: 30 })
  @MaxLength(30)
  trackCode: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastTrackedAt: Date;
}
