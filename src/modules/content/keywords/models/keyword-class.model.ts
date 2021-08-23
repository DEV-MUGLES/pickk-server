import { ObjectType } from '@nestjs/graphql';

import { KeywordClassEntity } from '../entities';

@ObjectType()
export class KeywordClass extends KeywordClassEntity {}
