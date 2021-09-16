import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsEnum, Max, MaxLength, Min } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { KeywordClassType } from '../constants';
import { IKeywordClass } from '../interfaces';

@ObjectType()
@Entity({ name: 'keyword_class' })
export class KeywordClassEntity extends BaseIdEntity implements IKeywordClass {
  constructor(attributes?: Partial<KeywordClassEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.type = attributes.type;
    this.name = attributes.name;
    this.order = attributes.order;
    this.isVisible = attributes.isVisible;
  }

  @Field(() => KeywordClassType)
  @Column({ type: 'enum', enum: KeywordClassType })
  @IsEnum(KeywordClassType)
  type: KeywordClassType;
  @Field()
  @Column({ length: 30 })
  @MaxLength(30)
  name: string;
  @Field(() => Int, { description: '0~255 정수', nullable: true })
  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  @Min(0)
  @Max(255)
  order: number;
  @Field()
  @Column({ default: true })
  isVisible: boolean;
}
