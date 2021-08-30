import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
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
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column({ length: 20 })
  @MaxLength(20)
  statusText: string;
  @Field()
  @Column({ length: 20 })
  @MaxLength(20)
  locationName: string;
  @Field()
  @Column()
  time: Date;

  @ManyToOne('ShipmentEntity', 'histories')
  shipment: Shipment;
  @Field(() => Int)
  @Column({ nullable: true })
  shipmentId: number;
}
