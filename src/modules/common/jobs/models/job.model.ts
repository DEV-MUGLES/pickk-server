import { ObjectType } from '@nestjs/graphql';

import { JobEntity } from '../entities';

@ObjectType()
export class Job extends JobEntity {}
