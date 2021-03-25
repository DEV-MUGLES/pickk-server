import { InputType, PartialType, PickType, Field } from '@nestjs/graphql';

import { User } from '../models/user.model';

@InputType()
export class CreateUserInput extends PickType(
  User,
  ['code', 'email', 'name', 'weight', 'height'],
  InputType
) {
  @Field()
  password: string;
}

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(User, ['code', 'email', 'name', 'weight', 'height'], InputType)
) {}
