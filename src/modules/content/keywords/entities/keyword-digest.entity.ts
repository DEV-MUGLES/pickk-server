import { BaseIdEntity } from '@common/entities';
import { IDigest } from '@content/digests/interfaces';
import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IKeyword, IKeywordDigest } from '../interfaces';

@ObjectType()
@Entity({ name: 'keyword_digest' })
export class KeywordDigestEntity
  extends BaseIdEntity
  implements IKeywordDigest
{
  constructor(attributes?: Partial<KeywordDigestEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.keyword = attributes.keyword;
    this.keywordId = attributes.keywordId;

    this.digest = attributes.digest;
    this.digestId = attributes.digestId;

    this.order = attributes.order;
  }

  @ManyToOne('KeywordEntity', 'keywordDigests', {
    onDelete: 'CASCADE',
  })
  keyword: IKeyword;
  @Column()
  keywordId: number;

  @ManyToOne('DigestEntity', { onDelete: 'CASCADE' })
  digest: IDigest;
  @Column()
  digestId: number;

  @Column({ type: 'smallint', default: 0 })
  order: number;
}
