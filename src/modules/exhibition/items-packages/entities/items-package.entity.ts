import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IItemsPackage, IItemsPackageItem } from '../interfaces';

@ObjectType()
@Entity({ name: 'items_package' })
@Index('idx-code', ['code'], { unique: true })
export class ItemsPackageEntity extends BaseIdEntity implements IItemsPackage {
  constructor(attributes?: Partial<ItemsPackageEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.packageItems = attributes.packageItems;

    this.code = attributes.code;
    this.title = attributes.title;
  }

  @OneToMany('ItemsPackageItemEntity', 'package', { cascade: true })
  packageItems: IItemsPackageItem[];

  @Field({ description: '최대 50자' })
  @Column({ unique: true, length: 50 })
  code: string;
  @Field({ description: '최대 50자' })
  @Column({ length: 50 })
  title: string;
}
