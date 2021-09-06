import { Field, ObjectType } from '@nestjs/graphql';

import { Look } from '@content/looks/models';
import { Video } from '@content/videos/models';
import { isPickkImageUrl } from '@common/decorators';
import { ItemPropertyValue } from '@item/item-properties/models';

import { CreateDigestImageInput } from '../dtos';
import { DigestEntity } from '../entities';

import { DigestImage } from './digest-image.model';

@ObjectType()
export class Digest extends DigestEntity {
  @Field({ nullable: true })
  video: Video;
  @Field({ nullable: true })
  look: Look;

  @Field(() => [DigestImage])
  images: DigestImage[];

  public createDigestImages = (
    createDigestImageInput: CreateDigestImageInput
  ) => {
    const { urls } = createDigestImageInput;
    const pickkImageUrls = urls.filter(isPickkImageUrl);
    if (pickkImageUrls.length === 0) {
      return [];
    }

    this.images = pickkImageUrls.map(
      (url) => new DigestImage({ key: new URL(url).pathname.slice(1) })
    );

    return this.images;
  };

  public setItemPropertyValues = (itemPropertyValues: ItemPropertyValue[]) => {
    this.itemPropertyValues = itemPropertyValues ?? [];
  };
}
