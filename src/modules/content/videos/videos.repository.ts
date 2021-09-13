import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { VideoEntity } from './entities';
import { Video } from './models';

@EntityRepository(VideoEntity)
export class VideosRepository extends BaseRepository<VideoEntity, Video> {
  entityToModel(entity: VideoEntity, transformOptions = {}): Video {
    return plainToClass(Video, entity, transformOptions) as Video;
  }

  entityToModelMany(entities: VideoEntity[], transformOptions = {}): Video[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async checkBelongsTo(id: number, userId: number): Promise<boolean> {
    const result = await this.createQueryBuilder('video')
      .select('1')
      .where('video.id = :id', { id })
      .andWhere('video.userId = :userId', { userId })
      .take(1)
      .limit(1)
      .execute();
    return result?.length > 0;
  }
}
