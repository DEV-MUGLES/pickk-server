import { ObjectType } from '@nestjs/graphql';

import { CourierIssueEntity } from '../entities';

@ObjectType()
export class CourierIssue extends CourierIssueEntity {}
