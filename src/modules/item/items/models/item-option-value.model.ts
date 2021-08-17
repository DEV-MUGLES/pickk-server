import { ObjectType } from '@nestjs/graphql';

import { ItemOptionValueEntity } from '../entities';

@ObjectType()
export class ItemOptionValue extends ItemOptionValueEntity {}
