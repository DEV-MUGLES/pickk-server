import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { CommentRelationType } from './constants';
import { CommentFilter, CreateCommentInput, UpdateCommentInput } from './dtos';
import { Comment } from './models';

import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository
  ) {}

  async checkBelongsTo(id: number, userId: number): Promise<boolean> {
    return await this.commentsRepository.checkBelongsTo(id, userId);
  }

  async get(
    id: number,
    relations: CommentRelationType[] = []
  ): Promise<Comment> {
    return await this.commentsRepository.get(id, relations);
  }

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

  async create(userId: number, input: CreateCommentInput): Promise<Comment> {
    return await this.commentsRepository.save(
      new Comment({
        userId,
        ...input,
      })
    );
  }

  async update(id: number, input: UpdateCommentInput): Promise<Comment> {
    const comment = await this.get(id);

    return await this.commentsRepository.save(
      new Comment({
        ...comment,
        ...input,
      })
    );
  }

  /**
   * comment 레코드를 삭제하는 것이 아니라, 삭제처리하는 함수입니다.
   * 삭제처리는 isDeleted를 참으로 설정하고, user와 content정보를 null로 업데이트하는 것을 의미합니다.
   */
  async processDelete(id: number): Promise<Comment> {
    const comment = await this.get(id);

    return await this.commentsRepository.save(
      new Comment({
        ...comment,
        userId: null,
        mentionedUserId: null,
        content: null,
        likeCount: 0,
        isDeleted: true,
      })
    );
  }
}
