import { Field, ObjectType } from '@nestjs/graphql';

import { DigestEntity } from '../entities';
import { DigestImage } from './digest-image.model';

@ObjectType()
export class Digest extends DigestEntity {
  @Field(() => [DigestImage])
  images: DigestImage[];
}
