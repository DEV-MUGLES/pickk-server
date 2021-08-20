import { PickType } from '@nestjs/mapped-types';

import { Digest } from '../models';

export class UpdateDigestLikeCountDto extends PickType(Digest, ['likeCount']) {}
