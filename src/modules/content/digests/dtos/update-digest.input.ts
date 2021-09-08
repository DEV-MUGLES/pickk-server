import { InputType, PartialType } from '@nestjs/graphql';

import { CreateDigestInput } from './create-digest.input';

@InputType()
export class UpdateDigestInput extends PartialType(
  CreateDigestInput,
  InputType
) {}
