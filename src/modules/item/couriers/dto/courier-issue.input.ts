import { InputType, PickType } from '@nestjs/graphql';

import { CourierIssue } from '../models/courier-issue.model';

@InputType()
export class UpdateCourierIssueInput extends PickType(
  CourierIssue,
  ['message', 'endAt'],
  InputType
) {}
