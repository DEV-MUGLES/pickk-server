import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import {
  bulkEnrichIsMine,
  bulkEnrichUserIsMe,
  parseFilter,
} from '@common/helpers';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';

import { CommentRelationType } from './constants';
import { CommentFilter, CreateCommentInput, UpdateCommentInput } from './dtos';
import { Comment } from './models';
import { CommentsProducer } from './producers';

import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsProducer: CommentsProducer,
    private readonly likesService: LikesService
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
    relations: CommentRelationType[] = [],
    userId?: number
  ): Promise<Comment[]> {
    const _filter = plainToClass(CommentFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    const comments = this.commentsRepository.entityToModelMany(
      await this.commentsRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
      })
    );

    await this.likesService.bulkEnrichLiking(
      userId,
      LikeOwnerType.Comment,
      comments
    );
    bulkEnrichIsMine(userId, comments);
    bulkEnrichUserIsMe(userId, comments);

    return comments;
  }

  async create(userId: number, input: CreateCommentInput): Promise<Comment> {
    const comment = await this.commentsRepository.save(
      new Comment({
        userId,
        ...input,
      })
    );
    await this.commentsProducer.updateOwnerCommentCount(
      comment.ownerId,
      comment.ownerType
    );

    return comment;
  }

  async update(id: number, input: UpdateCommentInput): Promise<Comment> {
    const comment = await this.get(id);

    if (input.content && input.content != comment.content) {
      comment.isContentUpdated = true;
      comment.contentUpdatedAt = new Date();
    }

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

    const deletedComment = await this.commentsRepository.save(
      new Comment({
        ...comment,
        userId: null,
        mentionedUserId: null,
        content: null,
        likeCount: 0,
        isDeleted: true,
      })
    );
    await this.commentsProducer.updateOwnerCommentCount(
      deletedComment.ownerId,
      deletedComment.ownerType
    );

    return deletedComment;
  }
}
