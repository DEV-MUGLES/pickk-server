import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IItemsExhibition, IItemsExhibitionItem } from '../interfaces';

@ObjectType()
@Entity({ name: 'items_exhibition' })
export class ItemsExhibitionEntity
  extends BaseIdEntity
  implements IItemsExhibition
{
  constructor(attributes?: Partial<ItemsExhibitionEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.exhibitionItems = attributes.exhibitionItems;

    this.title = attributes.title;
    this.description = attributes.description;

    this.imageUrl = attributes.imageUrl;
    this.imageTop = attributes.imageTop;
    this.imageRight = attributes.imageRight;
    this.backgroundColor = attributes.backgroundColor;

    this.isVisible = attributes.isVisible;
    this.order = attributes.order;
  }

  @OneToMany('ItemsExhibitionItemEntity', 'exhibition', { cascade: true })
  exhibitionItems: IItemsExhibitionItem[];

  @Field({ description: '최대 50자' })
  @Column({ length: 50 })
  title: string;
  @Field({ description: '최대 50자', nullable: true })
  @Column({ length: 50, nullable: true })
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl: string;
  @Field()
  @Column({ type: 'smallint', default: 0 })
  imageTop: number;
  @Field()
  @Column({ type: 'smallint', default: 0 })
  imageRight: number;
  @Field({ description: '최대 12자', nullable: true })
  @Column({ length: 12, nullable: true })
  backgroundColor: string;

  @Field({ defaultValue: true })
  @Column({ default: true })
  isVisible: boolean;
  @Field()
  @Column({ type: 'smallint', default: 0 })
  order: number;
}
