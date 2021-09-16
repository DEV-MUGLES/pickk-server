import { Field, ObjectType } from '@nestjs/graphql';

import { Look } from '@content/looks/models';
import { Video } from '@content/videos/models';
import { Item } from '@item/items/models';
import { ItemPropertyValue } from '@item/item-properties/models';
import { User } from '@user/users/models';

import { DigestEntity } from '../entities';

import { DigestImage } from './digest-image.model';

@ObjectType()
export class Digest extends DigestEntity {
  @Field(() => Item, { nullable: true })
  item: Item;
  @Field(() => User, { nullable: true })
  user: User;

  @Field({ nullable: true })
  video: Video;
  @Field({ nullable: true })
  look: Look;

  @Field(() => [ItemPropertyValue])
  itemPropertyValues: ItemPropertyValue[];
  @Field(() => [DigestImage])
  images: DigestImage[];
}
