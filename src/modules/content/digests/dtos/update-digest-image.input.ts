import { InputType } from '@nestjs/graphql';

import { CreateDigestImageInput } from './create-digest-image.input';

@InputType()
export class UpdateDigestImageInput extends CreateDigestImageInput {}
