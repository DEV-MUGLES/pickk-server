import { ObjectType } from '@nestjs/graphql';

import { LookImageEntity } from '../entities';

@ObjectType()
export class LookImage extends LookImageEntity {}
