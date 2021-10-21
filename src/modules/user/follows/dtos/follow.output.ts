import { ObjectType, PickType } from '@nestjs/graphql';

import { User } from '@user/users/models';

@ObjectType()
export class FollowOutput extends PickType(User, ['id', 'isFollowing']) {}
