import { Field, ObjectType } from '@nestjs/graphql';

import { Look } from '@content/looks/models';
import { Video } from '@content/videos/models';
import { isPickkImageUrl } from '@common/decorators';
import { parseToImageKey } from '@common/helpers';

import { UpdateDigestInput } from '../dtos';
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

  public update(input: UpdateDigestInput) {
    const updatedDigest = new Digest({ ...this, ...input });
    updatedDigest.updateDigestImages(input.imageInput.urls);
    return updatedDigest;
  }

  public createDigestImages(urls: string[]) {
    this.images = urls
      .filter(isPickkImageUrl)
      .map((url, index) => DigestImageFactory.from(url, index));
    return this.images;
  }
  // TODO: QUEUE 삭제된 이미지 S3에서 제거하는 작업
  public updateDigestImages(urls: string[]) {
    const updatedImages = urls.filter(isPickkImageUrl).map((url, index) => {
      const existImage = this.images.find(
        ({ key }) => key === parseToImageKey(url)
      );
      if (existImage) {
        existImage.order = index;
        return existImage;
      }
      return DigestImageFactory.from(url, index);
    });

    //update된 이미지들과 order가 중복되는 image들을 제거한다.
    const deletedImages = this.images.filter(({ order }) =>
      updatedImages.findIndex((updatedImage) => updatedImage.order === order)
    );

    this.images = updatedImages;
  }
}
