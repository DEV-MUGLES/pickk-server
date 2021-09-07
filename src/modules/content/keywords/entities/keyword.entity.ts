import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
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

import { DigestEntity } from '@content/digests/entities';
import { Digest } from '@content/digests/models';
import { LookEntity } from '@content/looks/entities';
import { Look } from '@content/looks/models';
import { StyleTagEntity } from '@content/style-tags/entities';
import { StyleTag } from '@content/style-tags/models';

import { IKeyword } from '../interfaces';
import { KeywordClass } from '../models/keyword-class.model';

import { KeywordClassEntity } from './keyword-class.entity';

@ObjectType()
@Entity({ name: 'keyword' })
@Index('idx_score', ['score'])
export class KeywordEntity extends BaseIdEntity implements IKeyword {
  constructor(attributes?: Partial<KeywordEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.name = attributes.name;
    this.imageUrl = attributes.imageUrl;
    this.content = attributes.content;
    this.stylingTip = attributes.stylingTip;
    this.usablityRate = attributes.usablityRate;
    this.isVisible = attributes.isVisible;

    this._matchTagNames = attributes._matchTagNames;

    this.styleTags = attributes.styleTags;
    this.looks = attributes.looks;
    this.digests = attributes.digests;

    this.relatedKeywords = attributes.relatedKeywords;
    this.classes = attributes.classes;

    this.likeCount = attributes.likeCount;
    this.hitCount = attributes.hitCount;
    this.score = attributes.score;

    this.isOwning = attributes.isOwning;
    this.isLiking = attributes.isLiking;
  }

  @Field()
  @Column({ length: 30 })
  @IsString()
  @MaxLength(30)
  name: string;
  @Field()
  @Column()
  @IsString()
  @MaxLength(255)
  imageUrl: string;
  @Field()
  @Column()
  @IsString()
  @MaxLength(255)
  content: string;
  @Field({ description: '스타일팁 줄글' })
  @Column()
  @IsString()
  @MaxLength(255)
  stylingTip: string;
  @Field(() => Int, {
    description: '0~100 정수. 필수템에 표시될 녀석들한테만 존재',
  })
  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  @IsInt()
  @Min(0)
  @Max(100)
  usablityRate: number;
  @Field()
  @Column({ default: true })
  @IsBoolean()
  @IsOptional()
  isVisible: boolean;

  @Field(() => [StyleTag])
  @ManyToMany(() => StyleTagEntity)
  @JoinTable()
  styleTags: StyleTag[];
  @Field(() => [Look])
  @ManyToMany(() => LookEntity)
  @JoinTable()
  looks: Look[];
  @Field(() => [Digest])
  @ManyToMany(() => DigestEntity)
  @JoinTable()
  digests: Digest[];

  @ManyToMany(() => KeywordEntity)
  @JoinTable()
  relatedKeywords: KeywordEntity[];
  @Column({ name: 'matchTagNames', length: 100 })
  _matchTagNames: string;
  @Field(() => [String])
  get matchTagNames(): string[] {
    return this._matchTagNames.split(',').map((v) => v.trim());
  }
  set matchTagNames(input: string[]) {
    this._matchTagNames = input.join(',');
  }

  @Field(() => [KeywordClass])
  @ManyToMany(() => KeywordClassEntity)
  @JoinTable()
  classes: KeywordClass[];

  // queue에서 계산해서 update하는 값들
  @Field(() => Int, { defaultValue: 0 })
  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  likeCount: number;
  @Field(() => Int, { defaultValue: 0 })
  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  hitCount: number;
  @Field({ defaultValue: 0 })
  @Column({ type: 'float', default: 0 })
  score: number;

  @Field({ description: '보유중 여부', nullable: true })
  isOwning: boolean;
  @Field({ description: '좋아요 중 여부', nullable: true })
  isLiking: boolean;
}
