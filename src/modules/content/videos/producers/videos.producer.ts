import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import {
  SEND_VIDEO_CREATION_SLACK_MESSAGE_QUEUE,
  UPDATE_YOUTUBE_VIDEO_DATAS_QUEUE,
} from '@queue/constants';
import {
  SendVideoCreationSlackMessageMto,
  UpdateYoutubeVideoDatasMto,
} from '@queue/mtos';

@Injectable()
export class VideosProducer {
  constructor(private readonly sqsService: SqsService) {}

  async sendVideoCreationSlackMessage(id: number) {
    return await this.sqsService.send<SendVideoCreationSlackMessageMto>(
      SEND_VIDEO_CREATION_SLACK_MESSAGE_QUEUE,
      {
        id: getRandomUuid(),
        body: {
          id,
        },
      }
    );
  }

  async updateYoutubeVideoData(youtubeCodes: string[]) {
    return await this.sqsService.send<UpdateYoutubeVideoDatasMto>(
      UPDATE_YOUTUBE_VIDEO_DATAS_QUEUE,
      {
        id: getRandomUuid(),
        body: {
          youtubeCodes,
        },
      }
    );
  }
}
