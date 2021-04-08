import { Field, ObjectType } from '@nestjs/graphql';

import { AddItemUrlInput } from '../dtos/item-url.input';
import { ItemEntity } from '../entities/item.entity';
import { ItemDetailImage } from './item-detail-image.model';
import { ItemUrl } from './item-url.model';

@ObjectType()
export class Item extends ItemEntity {
  @Field(() => [ItemUrl])
  urls: ItemUrl[];

  @Field(() => [ItemDetailImage], { nullable: true, defaultValue: [] })
  detailImages: ItemDetailImage[];

  private setPrimaryUrl = (index: number): void => {
    this.urls.forEach((shippingAddress, _index) => {
      shippingAddress.isPrimary = _index === index;
    });
  };

  public addUrl = (addItemUrlInput: AddItemUrlInput): ItemUrl => {
    const itemUrl = new ItemUrl(addItemUrlInput);
    this.urls = (this.urls ?? []).concat(itemUrl);
    if (addItemUrlInput.isPrimary || this.urls.length === 1) {
      this.setPrimaryUrl(this.urls.length - 1);
    }
    return itemUrl;
  };
}
