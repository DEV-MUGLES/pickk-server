import { ObjectType } from '@nestjs/graphql';

import { LikeEntity } from '../entities';

@ObjectType()
export class Like extends LikeEntity {}
