import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsString, MaxLength, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { IShipmentHistory } from '../interfaces';
import { Shipment } from '../models';

@ObjectType()
@Entity('shipment_history')
export class ShipmentHistoryEntity implements IShipmentHistory {
  constructor(attributes?: Partial<ShipmentHistoryEntity>) {
    if (!attributes) {
      return;
    }
    this.id = attributes.id;
    this.createdAt = attributes.createdAt;

    this.statusText = attributes.statusText;
    this.locationName = attributes.locationName;
    this.time = attributes.time;

    this.shipment = attributes.shipment;
    this.shipmentId = attributes.shipmentId;
  }
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @IsString()
  @MaxLength(20)
  @Column({ type: 'varchar', length: 20 })
  statusText: string;
  @Field()
  @IsString()
  @MaxLength(20)
  @Column({ type: 'varchar', length: 20 })
  locationName: string;
  @Field()
  @IsDate()
  @Column()
  time: Date;

  @ManyToOne('ShipmentEntity', 'histories')
  shipment: Shipment;

  @Field(() => Int)
  @Column({ type: 'int' })
  shipmentId: number;
}
