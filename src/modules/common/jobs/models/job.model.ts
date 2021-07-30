import { ObjectType } from '@nestjs/graphql';
import { JobEntity } from '../entities/job.entity';

@ObjectType()
export class Job extends JobEntity {}
