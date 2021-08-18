import { Field, ObjectType } from '@nestjs/graphql';

import { Look } from '@content/looks/models';
import { Video } from '@content/videos/models';

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
}
