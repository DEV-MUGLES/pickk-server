import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { ILook } from '@content/looks/interfaces';

import { IKeyword, IKeywordLook } from '../interfaces';

@ObjectType()
@Entity({ name: 'keyword_look' })
export class KeywordLookEntity extends BaseIdEntity implements IKeywordLook {
  constructor(attributes?: Partial<KeywordLookEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.keyword = attributes.keyword;
    this.keywordId = attributes.keywordId;

    this.look = attributes.look;
    this.lookId = attributes.lookId;

    this.order = attributes.order;
  }

  @ManyToOne('KeywordEntity', 'keywordLooks', {
    onDelete: 'CASCADE',
  })
  keyword: IKeyword;
  @Column()
  keywordId: number;

  @ManyToOne('LookEntity', { onDelete: 'CASCADE' })
  look: ILook;
  @Column()
  lookId: number;

  @Column({ type: 'smallint', default: 0 })
  order: number;
}
