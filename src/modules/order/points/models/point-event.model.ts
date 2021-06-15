import { ObjectType } from '@nestjs/graphql';

import { PointEventEntity } from '../entities/point-event.entity';

@ObjectType()
export class PointEvent extends PointEventEntity {}
