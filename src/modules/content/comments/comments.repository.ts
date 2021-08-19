import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { CommentEntity } from './entities';
import { Comment } from './models';

@EntityRepository(CommentEntity)
export class CommentsRepository extends BaseRepository<CommentEntity, Comment> {
  entityToModel(entity: CommentEntity, transformOptions = {}): Comment {
    return plainToClass(Comment, entity, transformOptions) as Comment;
  }

  entityToModelMany(
    entities: CommentEntity[],
    transformOptions = {}
  ): Comment[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async checkBelongsTo(id: number, userId: number): Promise<boolean> {
    const result = await this.createQueryBuilder('comment')
      .select('1')
      .where('comment.id = :id', { id })
      .andWhere('comment.userId = :userId', { userId })
      .execute();
    return result?.length > 0;
  }
}
