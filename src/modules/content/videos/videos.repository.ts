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
}
