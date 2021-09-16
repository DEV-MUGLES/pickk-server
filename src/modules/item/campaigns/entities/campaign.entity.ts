import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { BaseIdEntity } from '@common/entities';
import { IItem } from '@item/items/interfaces';

import { ICampaign } from '../interfaces';

@ObjectType()
@Entity('campaign')
export class CampaignEntity extends BaseIdEntity implements ICampaign {
  constructor(attributes?: Partial<CampaignEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.items = attributes.items;

    this.rate = attributes.rate;

    this.startAt = attributes.startAt;
    this.endAt = attributes.endAt;
  }

  @ManyToMany('ItemEntity', 'campaigns')
  @JoinTable()
  items: IItem[];

  @Field(() => Int, { description: '적용 정산률 (0~100)' })
  @Column({ type: 'tinyint', unsigned: true })
  rate: number;

  @Field()
  @Column()
  startAt: Date;
  @Field()
  @Column()
  endAt: Date;
}
