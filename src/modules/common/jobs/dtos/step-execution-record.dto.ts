import { PickType } from '@nestjs/mapped-types';

import { StepExecutionRecord } from '../models';

export class CreateStepExecutionRecordDto extends PickType(
  StepExecutionRecord,
  ['stepName', 'jobExecutionRecordId']
) {}
