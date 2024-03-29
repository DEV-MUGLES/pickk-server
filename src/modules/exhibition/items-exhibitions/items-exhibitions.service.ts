import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ItemsExhibitionRelationType } from './constants';
import { ItemsExhibition, ItemsExhibitionItem } from './models';

import {
  ItemsExhibitionItemsRepository,
  ItemsExhibitionsRepository,
} from './items-exhibitions.repository';
import { CreateItemsExhibitionInput, UpdateItemsExhibitionInput } from './dtos';

@Injectable()
export class ItemsExhibitionsService {
  constructor(
    @InjectRepository(ItemsExhibitionsRepository)
    private readonly itemsExhibitionsRepository: ItemsExhibitionsRepository,
    @InjectRepository(ItemsExhibitionItemsRepository)
    private readonly itemsExhibitionItemsRepository: ItemsExhibitionItemsRepository
  ) {}

  async create(input: CreateItemsExhibitionInput): Promise<ItemsExhibition> {
    return await this.itemsExhibitionsRepository.save(
      new ItemsExhibition({
        ...input,
        exhibitionItems: input.itemIds.map(
          (itemId, idx) => new ItemsExhibitionItem({ itemId, order: idx })
        ),
      })
    );
  }

  async get(
    id: number,
    relations: ItemsExhibitionRelationType[] = []
  ): Promise<ItemsExhibition> {
    return await this.itemsExhibitionsRepository.get(id, relations);
  }

  async list(
    relations: ItemsExhibitionRelationType[] = []
  ): Promise<ItemsExhibition[]> {
    return this.itemsExhibitionsRepository.entityToModelMany(
      await this.itemsExhibitionsRepository.find({
        relations,
      })
    );
  }

  async update(
    id: number,
    input: UpdateItemsExhibitionInput
  ): Promise<ItemsExhibition> {
    const exhibition = await this.get(id);

    return await this.itemsExhibitionsRepository.save(
      new ItemsExhibition({
        ...exhibition,
        ...input,
      })
    );
  }

  async updateItems(id: number, itemIds: number[]): Promise<void> {
    const exhibition = await this.get(id, ['exhibitionItems']);

    await this.itemsExhibitionItemsRepository.remove(
      exhibition.exhibitionItems
    );

    exhibition.exhibitionItems = itemIds.map(
      (itemId, index) =>
        new ItemsExhibitionItem({
          itemId,
          order: index,
        })
    );

    await this.itemsExhibitionsRepository.save(exhibition);
  }
}
