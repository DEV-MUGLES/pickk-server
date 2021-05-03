import { Field, ObjectType } from '@nestjs/graphql';

import { AddItemUrlInput } from '../dtos/item-url.input';
import { ItemEntity } from '../entities/item.entity';
import { ItemDetailImage } from './item-detail-image.model';
import { ItemOption } from './item-option.model';
import { ItemUrl } from './item-url.model';
import { Product } from '../../products/models/product.model';
import { SellPriceReservation } from '../../sell-price-reservations/models/sell-price-reservation.model';

@ObjectType()
export class Item extends ItemEntity {
  @Field(() => [ItemUrl])
  urls: ItemUrl[];

  @Field(() => [ItemDetailImage], { nullable: true })
  detailImages: ItemDetailImage[];

  @Field(() => [ItemOption], {
    nullable: true,
  })
  options: ItemOption[];

  @Field(() => [Product], {
    nullable: true,
  })
  products: Product[];

  @Field(() => SellPriceReservation, {
    nullable: true,
  })
  sellPriceReservation?: SellPriceReservation;

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
