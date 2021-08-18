import { ObjectType } from '@nestjs/graphql';

import { DigestImageEntity } from '../entities';

@ObjectType()
export class DigestImage extends DigestImageEntity {}
