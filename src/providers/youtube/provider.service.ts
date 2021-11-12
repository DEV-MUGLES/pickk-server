import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { IYoutubeVideoData } from './interfaces';

@Injectable()
export class YoutubeProviderService {
  private baseUrl = 'https://youtube-crawl.pickk.one/api';
  constructor(private readonly httpService: HttpService) {}

  async getVideoData(youtubeCode: string): Promise<IYoutubeVideoData> {
    const { data } = await firstValueFrom(
      this.httpService.get<IYoutubeVideoData>(
        `${this.baseUrl}/video-data?code=${youtubeCode}`
      )
    );
    if (!data.viewCount || !data.durationMs) {
      throw new InternalServerErrorException(
        '크롤링 된 유튜브 정보가 잘못됐습니다.'
      );
    }

    return data;
  }
}
