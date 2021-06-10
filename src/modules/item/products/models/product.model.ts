import { Field, ObjectType } from '@nestjs/graphql';

import { Item } from '../../items/models/item.model';
import { ProductEntity } from '../entities/product.entity';

@ObjectType()
export class Product extends ProductEntity {
  @Field(() => Item)
  item: Item;
}
