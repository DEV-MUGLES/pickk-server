import { ObjectType } from '@nestjs/graphql';

import { ItemProfileEntity } from '../entities/item-profile.entity';

@ObjectType()
export class ItemProfile extends ItemProfileEntity {}
