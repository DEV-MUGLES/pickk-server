import { ObjectType } from '@nestjs/graphql';

import { CartItemEntity } from '../entities/cart-item.entity';

@ObjectType()
export class CartItem extends CartItemEntity {}
