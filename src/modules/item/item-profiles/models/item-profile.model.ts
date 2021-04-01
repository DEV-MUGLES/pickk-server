import { ObjectType } from '@nestjs/graphql';
import { AddItemProfileUrlInput } from '../dtos/item-profile-url.input';

import { ItemProfileEntity } from '../entities/item-profile.entity';
import { ItemProfileUrl } from './item-profile-url.model';

@ObjectType()
export class ItemProfile extends ItemProfileEntity {
  private setPrimaryUrl = (index: number): void => {
    this.urls.forEach((shippingAddress, _index) => {
      shippingAddress.isPrimary = _index === index;
    });
  };

  public addUrl = (
    addItemProfileUrlInput: AddItemProfileUrlInput
  ): ItemProfileUrl => {
    const itemProfileUrl = new ItemProfileUrl(addItemProfileUrlInput);
    this.urls = (this.urls ?? []).concat(itemProfileUrl);
    if (addItemProfileUrlInput.isPrimary || this.urls.length === 1) {
      this.setPrimaryUrl(this.urls.length - 1);
    }
    return itemProfileUrl;
  };
}
