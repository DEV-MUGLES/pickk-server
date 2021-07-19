import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

import { BaseIdEntity } from '@common/entities';
import { IItemSalePolicy } from '../interfaces/item-sale-policy.interface';
import { IsNumber, Max, Min } from 'class-validator';

@ObjectType()
@Entity({
  name: 'item_sale_policy',
})
export class ItemSalePolicyEntity
  extends BaseIdEntity
  implements IItemSalePolicy
{
  @Field()
  @Column()
  isUsingStock: boolean;

  @Field(() => Int)
  @Column({
    type: 'tinyint',
    unsigned: true,
  })
  @IsNumber()
  @Min(0)
  @Max(255)
  quantityLimit: number;

  @Field()
  @Column()
  isUsingQuantityLimit: boolean;
}

export const DEFAULT_ITEM_SALE_POLICY: IItemSalePolicy = {
  isUsingStock: false,
  quantityLimit: 0,
  isUsingQuantityLimit: false,
};
