import { ObjectType } from '@nestjs/graphql';

import { OwnEntity } from '../entities';

@ObjectType()
export class Own extends OwnEntity {}
