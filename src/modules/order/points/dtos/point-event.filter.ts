import { Field, InputType, Int } from '@nestjs/graphql';

import { IPointEvent } from '../interfaces/point-event.interface';

@InputType()
export class PointEventFilter implements Partial<IPointEvent> {
  @Field(() => Int, {
    nullable: true,
  })
  userId?: number;
}
