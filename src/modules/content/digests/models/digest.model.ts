import { Field, ObjectType } from '@nestjs/graphql';

import { Look } from '@content/looks/models';
import { Video } from '@content/videos/models';
import { isPickkImageUrl } from '@common/decorators';

import { DigestEntity } from '../entities';
import { DigestImageFactory } from '../factories';

import { DigestImage } from './digest-image.model';

@ObjectType()
export class Digest extends DigestEntity {
  @Field({ nullable: true })
  video: Video;
  @Field({ nullable: true })
  look: Look;

  @Field(() => [DigestImage])
  images: DigestImage[];

  public createDigestImages(urls: string[]) {
    this.images = urls
      .filter(isPickkImageUrl)
      .map((url, index) => DigestImageFactory.from(url, index));
    return this.images;
  }
}
