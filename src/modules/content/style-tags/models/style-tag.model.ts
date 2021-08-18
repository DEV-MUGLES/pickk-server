import { ObjectType } from '@nestjs/graphql';

import { StyleTagEntity } from '../entities';

@ObjectType()
export class StyleTag extends StyleTagEntity {}
