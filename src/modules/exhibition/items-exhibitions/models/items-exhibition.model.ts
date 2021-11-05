import { Field, ObjectType } from '@nestjs/graphql';

import { Video } from '@content/videos/models';
import { Item } from '@item/items/models';

import { ItemsExhibitionEntity } from '../entities';

import { ItemsExhibitionItem } from './items-exhibition-item.model';

@ObjectType()
export class ItemsExhibition extends ItemsExhibitionEntity {
  exhibitionItems: ItemsExhibitionItem[];

  @Field({ nullable: true })
  video: Video;

  @Field(() => [Item])
  get items(): Item[] {
    if (!this.exhibitionItems) {
      return [];
    }

    return this.exhibitionItems
      .sort((a, b) => a.order - b.order)
      .map((v) => v.item);
  }
}
