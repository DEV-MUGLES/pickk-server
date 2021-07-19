import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsEnum, IsOptional } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { ItemNoticeType } from '../constants/item-notice.enum';
import { IItemNotice } from '../interfaces/item-notice.interface';

@ObjectType()
@Entity({
  name: 'item_notice',
})
export class ItemNoticeEntity extends BaseIdEntity implements IItemNotice {
  constructor(attributes?: Partial<ItemNoticeEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.type = attributes.type;
    this.message = attributes.message;
    this.startAt = attributes.startAt;
    this.endAt = attributes.endAt;
  }

  @Field(() => ItemNoticeType, { nullable: true })
  @Column({
    type: 'enum',
    enum: ItemNoticeType,
    default: ItemNoticeType.General,
  })
  @IsEnum(ItemNoticeType)
  @IsOptional()
  type: ItemNoticeType;

  @Field()
  @Column()
  message: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  startAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  endAt?: Date;
}
