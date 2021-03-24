import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity as _TypeORMBaseEntity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';

import { IImage } from '../interfaces/image.interface';

@ObjectType()
export abstract class AbstractImageEntity
  extends _TypeORMBaseEntity
  implements IImage {
  @Field()
  @PrimaryColumn({
    type: 'varchar',
    length: 75,
  })
  key: string;

  @Field(() => Int)
  @Field()
  @Column({ default: 0 })
  angle: number;

  @Field()
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}
