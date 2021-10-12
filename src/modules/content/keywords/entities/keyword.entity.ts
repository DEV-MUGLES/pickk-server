import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { MaxLength } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { IStyleTag } from '@content/style-tags/interfaces';

import {
  IKeyword,
  IKeywordClass,
  IKeywordDigest,
  IKeywordLook,
} from '../interfaces';

@ObjectType()
@Entity({ name: 'keyword' })
@Index('idx-score', ['score'])
export class KeywordEntity extends BaseIdEntity implements IKeyword {
  constructor(attributes?: Partial<KeywordEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.classes = attributes.classes;

    this.styleTags = attributes.styleTags;
    this.keywordLooks = attributes.keywordLooks;
    this.keywordDigests = attributes.keywordDigests;
    this.relatedKeywords = attributes.relatedKeywords;

    this.name = attributes.name;
    this.imageUrl = attributes.imageUrl;
    this.content = attributes.content;
    this.stylingTip = attributes.stylingTip;
    this.usablityRate = attributes.usablityRate;

    this.isVisible = attributes.isVisible;

    this._matchTagNames = attributes._matchTagNames;

    this.likeCount = attributes.likeCount;
    this.hitCount = attributes.hitCount;
    this.score = attributes.score;

    this.isOwning = attributes.isOwning;
    this.isLiking = attributes.isLiking;
  }

  @ManyToMany('KeywordClassEntity')
  @JoinTable()
  classes: IKeywordClass[];

  @ManyToMany('StyleTagEntity')
  @JoinTable()
  styleTags: IStyleTag[];
  @OneToMany('KeywordLookEntity', 'keyword', { cascade: true })
  keywordLooks: IKeywordLook[];
  @OneToMany('KeywordDigestEntity', 'keyword', { cascade: true })
  keywordDigests: IKeywordDigest[];
  @ManyToMany('KeywordEntity')
  @JoinTable()
  relatedKeywords: IKeyword[];

  @Field()
  @Column({ length: 30 })
  @MaxLength(30)
  name: string;
  @Field()
  @Column()
  @MaxLength(255)
  imageUrl: string;
  @Field()
  @Column()
  @MaxLength(255)
  content: string;
  @Field({ description: '스타일팁 줄글' })
  @Column()
  @MaxLength(255)
  stylingTip: string;
  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  usablityRate: number;

  @Field()
  @Column({ default: true })
  isVisible: boolean;

  @Column({ name: 'matchTagNames', length: 100 })
  _matchTagNames: string;
  @Field(() => [String])
  get matchTagNames(): string[] {
    return this._matchTagNames.split(',').map((v) => v.trim());
  }
  set matchTagNames(input: string[]) {
    this._matchTagNames = input.join(',');
  }

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
