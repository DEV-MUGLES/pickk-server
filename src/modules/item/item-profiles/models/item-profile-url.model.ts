import { ObjectType } from '@nestjs/graphql';

import { ItemProfileUrlEntity } from '../entities/item-profile-url.entity';

@ObjectType()
export class ItemProfileUrl extends ItemProfileUrlEntity {}
