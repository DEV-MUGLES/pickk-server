import { ObjectType } from '@nestjs/graphql';

import { KeywordMatchTagEntity } from '../entities';

@ObjectType()
export class KeywordMatchTag extends KeywordMatchTagEntity {}
