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

    this.exhibitionItems = attributes.exhibitionItems;

    this.title = attributes.title;
  }

  @OneToMany('ItemsExhibitionItemEntity', 'exhibition', { cascade: true })
  exhibitionItems: IItemsExhibitionItem[];

  @Field({ description: '최대 50자' })
  @Column({ length: 50 })
  title: string;
}
