import { InputType, PickType } from '@nestjs/graphql';

import { CourierIssue } from '../models';

@InputType()
export class UpdateCourierIssueInput extends PickType(
  CourierIssue,
  ['message', 'endAt'],
  InputType
) {}
