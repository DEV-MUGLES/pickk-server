import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '@src/modules/user/users/models/user.model';

@InputType()
export class LoginByEmailInput extends PickType(User, ['email'], InputType) {
  @Field()
  password: string;
}

@InputType()
export class LoginByCodeInput extends PickType(User, ['code'], InputType) {
  @Field()
  password: string;
}
