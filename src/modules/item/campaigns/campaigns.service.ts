import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ItemsService } from '@item/items/items.service';

import { CampaignRelationType } from './constants';
import { Campaign } from './models';

import { CampaignsRepository } from './campaigns.repository';
import { CreateCampaignInput, UpdateCampaignInput } from './dtos';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(CampaignsRepository)
    private readonly campaignsRepository: CampaignsRepository,
    private readonly itemsService: ItemsService
  ) {}

  async get(
    id: number,
    relations: CampaignRelationType[] = []
  ): Promise<Campaign> {
    return await this.campaignsRepository.get(id, relations);
  }

  async list(relations: CampaignRelationType[] = []): Promise<Campaign[]> {
    return this.campaignsRepository.entityToModelMany(
      await this.campaignsRepository.find({ relations })
    );
  }

  async create(input: CreateCampaignInput): Promise<Campaign> {
    return this.campaignsRepository.entityToModel(
      await this.campaignsRepository.save(new Campaign(input))
    );
  }

  async update(id: number, input: UpdateCampaignInput): Promise<Campaign> {
    const campaign = await this.get(id);
    if (!campaign) {
      throw new BadRequestException('존재하지 않는 캠페인입니다.');
    }

    return this.campaignsRepository.entityToModel(
      await this.campaignsRepository.save(
        new Campaign({ ...campaign, ...input })
      )
    );
  }

  async remove(id: number) {
    const campaign = await this.get(id);
    await this.campaignsRepository.remove(campaign);
  }

  async updateItems(id: number, itemIds: number[]): Promise<Campaign> {
    const campaign = await this.get(id);
    if (!campaign) {
      throw new BadRequestException('존재하지 않는 캠페인입니다.');
    }
    campaign.items = await this.itemsService.list({ idIn: itemIds });
    return await this.campaignsRepository.save(campaign);
  }
}
