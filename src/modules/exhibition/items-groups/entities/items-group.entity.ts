import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IItemsGroup, IItemsGroupItem } from '../interfaces';

@ObjectType()
@Entity({ name: 'items_group' })
export class ItemsGroupEntity extends BaseIdEntity implements IItemsGroup {
  constructor(attributes?: Partial<ItemsGroupEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.groupItems = attributes.groupItems;
  }

  @OneToMany('ItemsGroupItemEntity', 'group', { cascade: true })
  groupItems: IItemsGroupItem[];

  @Field()
  @Column()
  name: string;
}
