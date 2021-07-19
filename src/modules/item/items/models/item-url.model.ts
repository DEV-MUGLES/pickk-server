import { ObjectType } from '@nestjs/graphql';

import { ItemUrlEntity } from '../entities';

@ObjectType()
export class ItemUrl extends ItemUrlEntity {}
