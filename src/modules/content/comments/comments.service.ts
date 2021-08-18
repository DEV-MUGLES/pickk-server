import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { CommentRelationType } from './constants';
import { CommentFilter } from './dtos';
import { Comment } from './models';

import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository
  ) {}

  async list(
    filter?: CommentFilter,
    pageInput?: PageInput,
    relations: CommentRelationType[] = []
  ): Promise<Comment[]> {
    const _filter = plainToClass(CommentFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.commentsRepository.entityToModelMany(
      await this.commentsRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
        order: {
          id: 'DESC',
        },
      })
    );
  }
}
