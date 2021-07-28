import { InputType, PickType } from '@nestjs/graphql';

import { Pin } from '../models';

@InputType()
export class CheckPinInput extends PickType(
  Pin,
  ['phoneNumber', 'code'],
  InputType
) {}
