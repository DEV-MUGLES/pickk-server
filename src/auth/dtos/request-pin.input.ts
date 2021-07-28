import { InputType, PickType } from '@nestjs/graphql';
import { User } from '@user/users/models';

@InputType()
export class RequestPinInput extends PickType(
  User,
  ['phoneNumber'],
  InputType
) {}
