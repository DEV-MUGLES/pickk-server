import { ObjectType } from '@nestjs/graphql';

import { ItemPropertyValueEntity } from '../entities';

@ObjectType()
export class ItemPropertyValue extends ItemPropertyValueEntity {}
