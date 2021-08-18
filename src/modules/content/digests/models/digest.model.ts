import { Field, ObjectType } from '@nestjs/graphql';

import { Video } from '@content/videos/models';

import { DigestEntity } from '../entities';

import { DigestImage } from './digest-image.model';

@ObjectType()
export class Digest extends DigestEntity {
  @Field({ nullable: true })
  video: Video;

  @Field(() => [DigestImage])
  images: DigestImage[];
}
