import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany } from 'typeorm';
import { IsDate, IsNumber, Max, Min } from 'class-validator';

import { BaseIdEntity } from '@common/entities';
import { IItem } from '@item/items/interfaces';

import { ICampaign } from '../interfaces';

@ObjectType()
@Entity('campaign')
export class CampaignEntity extends BaseIdEntity implements ICampaign {
  @Field(() => Int, { description: '적용 정산률 (0~100)' })
  @Column({ type: 'tinyint', unsigned: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  rate: number;

  @ManyToMany('ItemEntity', 'campaigns')
  items: IItem[];

  @Field()
  @Column()
  @IsDate()
  startAt: Date;

  @Field()
  @Column()
  @IsDate()
  endAt: Date;
}
