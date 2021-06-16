import { Field, InputType, Int } from '@nestjs/graphql';

import { IPointEvent } from '../interfaces/point-event.interface';

@InputType()
export class PointEventFilter implements Partial<IPointEvent> {
  @Field({ nullable: true })
  createdAtMte: Date;

  @Field({ nullable: true })
  createdAtLte: Date;

  @Field(() => Int, {
    nullable: true,
  })
  userId?: number;
}
