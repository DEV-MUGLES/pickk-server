import { ObjectType } from '@nestjs/graphql';

import { FollowEntity } from '../entities';

@ObjectType()
export class Follow extends FollowEntity {}
