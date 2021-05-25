import { Field, InputType } from '@nestjs/graphql';
import { IItem } from '../interfaces/item.interface';
import { Item } from '../models/item.model';

@InputType()
export class ItemFilter implements Partial<IItem> {
  searchFields: Array<keyof Item> = ['name'];

  @Field({ nullable: true })
  isMdRecommended: boolean;

  @Field({ nullable: true })
  isSellable: boolean;

  @Field({ nullable: true })
  isPurchasable: boolean;

  @Field({ nullable: true })
  majorCategoryId: number;

  @Field({ nullable: true })
  minorCategoryId: number;

  @Field({ nullable: true, description: '아이템 이름(name)으로 검색합니다.' })
  search: string;

  @Field({ nullable: true })
  sellableAtMte: Date;

  @Field({ nullable: true })
  sellableAtLte: Date;

  @Field({ nullable: true })
  createdAtMte: Date;

  @Field({ nullable: true })
  createdAtLte: Date;
}
