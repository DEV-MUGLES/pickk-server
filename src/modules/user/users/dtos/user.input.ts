import { InputType, PartialType, PickType, Field } from '@nestjs/graphql';

import { User } from '../models';

@InputType()
export class CreateUserInput extends PickType(
  User,
  [
    'code',
    'email',
    'nickname',
    'name',
    'weight',
    'height',
    'oauthProvider',
    'oauthCode',
  ],
  InputType
) {
  @Field({ nullable: true })
  password: string;
}

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(
    User,
    ['code', 'email', 'name', 'weight', 'height', 'nickname'],
    InputType
  )
) {}
