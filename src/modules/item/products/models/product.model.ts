import { Field, ObjectType } from '@nestjs/graphql';

import { Item } from '@item/items/models';

import { ProductEntity } from '../entities';

@ObjectType()
export class Product extends ProductEntity {
  @Field(() => Item)
  item: Item;
}
