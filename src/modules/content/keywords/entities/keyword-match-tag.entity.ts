import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { IKeywordMatchTag } from '../interfaces';

@ObjectType()
@Entity({ name: 'keyword_match_tag' })
export class KeywordMatchTagEntity
  extends BaseIdEntity
  implements IKeywordMatchTag
{
  constructor(attributes?: Partial<KeywordMatchTagEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.name = attributes.name;
    this.order = attributes.order;
    this.isVisible = attributes.isVisible;
  }

  @Field()
  @Column({ length: 30 })
  @IsString()
  @MaxLength(30)
  name: string;
  @Field(() => Int, { description: '0~255 정수' })
  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  @IsInt()
  @Min(0)
  @Max(255)
  order: number;
  @Field()
  @Column({ default: true })
  @IsBoolean()
  @IsOptional()
  isVisible: boolean;
}
