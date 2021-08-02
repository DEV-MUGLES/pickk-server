import { ObjectType } from '@nestjs/graphql';

import { JobExecutionContextRecordEntity } from '../entities';

@ObjectType()
export class JobExecutionContextRecord extends JobExecutionContextRecordEntity {}
