import { ObjectType } from '@nestjs/graphql';

import { CourierIssueEntity } from '../entities/courier-issue.entity';

@ObjectType()
export class CourierIssue extends CourierIssueEntity {}
