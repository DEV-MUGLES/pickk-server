import { ObjectType } from '@nestjs/graphql';
import { JobExecutionContextRecordEntity } from '../entities/job-execution-context-record.entity';

@ObjectType()
export class JobExecutionContextRecord extends JobExecutionContextRecordEntity {}
