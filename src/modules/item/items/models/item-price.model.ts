import { ObjectType } from '@nestjs/graphql';

import { ItemPriceEntity } from '../entities/item-price.entity';

@ObjectType()
export class ItemPrice extends ItemPriceEntity {}
