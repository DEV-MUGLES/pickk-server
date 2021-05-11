import { ObjectType, PickType } from '@nestjs/graphql';

import { User } from '@src/modules/user/users/models/user.model';

@ObjectType()
export class RandomNickname extends PickType(User, ['nickname']) {}
