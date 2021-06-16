import { ObjectType } from '@nestjs/graphql';

import { ExpectedPointEventEntity } from '../entities/expected-point-event.entity';

@ObjectType()
export class ExpectedPointEvent extends ExpectedPointEventEntity {}
