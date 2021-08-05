import { getManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { ItemCategoryEntity } from '@item/item-categories/entities';
import { ItemCategoryData } from '@item/item-categories/constants';

import { BaseSeeder } from './base.seeder';

@Injectable()
export class ItemCategorySeeder extends BaseSeeder {
  private existCategories: ItemCategoryEntity[];

  async seed() {
    this.existCategories = await this.findEntities(ItemCategoryEntity);
    await this.createOrUpdate();
  }

  private async createOrUpdate() {
    const newMajorCategories = [];
    const newMinorCategories = [];

    ItemCategoryData.forEach(({ minorCategories, name, code }) => {
      const index = this.findSameCodeCategoryIndex(code);
      let parentEntity: ItemCategoryEntity = this.existCategories[index];
      if (index > -1) {
        this.existCategories[index].name = name;
      } else {
        parentEntity = new ItemCategoryEntity({ name, code });
        newMajorCategories.push(parentEntity);
      }

      minorCategories.forEach(({ code, name }) => {
        const index = this.findSameCodeCategoryIndex(code);
        if (index > -1) {
          this.existCategories[index].name = name;
        } else {
          newMinorCategories.push(
            new ItemCategoryEntity({ code, name, parent: parentEntity })
          );
        }
      });
    });

    await this.createCategory(newMajorCategories);
    await this.createCategory(newMinorCategories);

    await this.updateCategory();
    await this.removeCategory();
  }

  private findSameCodeCategoryIndex(code: string) {
    return this.existCategories.findIndex((v) => v.code === code);
  }

  private async createCategory(entities: ItemCategoryEntity[]) {
    if (entities.length < 1) {
      return;
    }
    await getManager().insert(ItemCategoryEntity, entities);
  }

  private async updateCategory() {
    await getManager().save(this.existCategories);
  }
  /**
   * 데이터베이스에 존재하는 카테고리 중, 변경된 ItemCategories에 따라 삭제되어야하는 카테고리들을 삭제하는 메소드입니다.
   */
  private async removeCategory() {
    const categoryCodes = this.getAllCategoryCodes();

    const deleteCategories = this.existCategories.filter(
      ({ code }) => !categoryCodes.includes(code)
    );

    await getManager().remove(deleteCategories);
  }

  private getAllCategoryCodes() {
    const result: string[] = [];
    ItemCategoryData.forEach(({ code, minorCategories }) => {
      result.push(code);
      minorCategories.forEach(({ code }) => {
        result.push(code);
      });
    });
    return result;
  }
}
