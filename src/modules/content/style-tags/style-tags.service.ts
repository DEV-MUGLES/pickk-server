import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StyleTag } from './models';
import { StyleTagsRepository } from './style-tags.repository';

@Injectable()
export class StyleTagsService {
  constructor(
    @InjectRepository(StyleTagsRepository)
    private readonly styleTagsRepository: StyleTagsRepository
  ) {}

  async list(): Promise<StyleTag[]> {
    return await this.styleTagsRepository.find({
      order: {
        order: 'ASC',
      },
    });
  }
}
