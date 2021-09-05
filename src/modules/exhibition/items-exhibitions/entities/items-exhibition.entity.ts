import { ObjectType } from '@nestjs/graphql';
import { Entity, OneToMany } from 'typeorm';

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
  }

  @OneToMany('ItemsExhibitionItemEntity', 'exhibition', {
    cascade: true,
    onDelete: 'CASCADE',
  })
  exhibitionItems: IItemsExhibitionItem[];
}
