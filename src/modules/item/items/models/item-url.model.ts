import { ObjectType } from '@nestjs/graphql';

import { ItemUrlEntity } from '../entities/item-url.entity';

@ObjectType()
export class ItemUrl extends ItemUrlEntity {}
