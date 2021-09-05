import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IItemsExhibition, IItemsExhibitionItem } from '../interfaces';

@ObjectType()
@Entity({ name: 'items_exhibition' })
export class ItemsExhibitionEntity
  extends BaseIdEntity
  implements IItemsExhibition
{
  constructor(attributes?: Partial<ItemsExhibitionEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.title = attributes.title;

    this.exhibitionItems = attributes.exhibitionItems;
  }

  @Field({ description: '최대 50자' })
  @Column({ length: 50 })
  title: string;

  @OneToMany('ItemsExhibitionItemEntity', 'exhibition', {
    cascade: true,
    onDelete: 'CASCADE',
  })
  exhibitionItems: IItemsExhibitionItem[];
}
