import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { TrackDeliveryDto } from './dtos';

@Injectable()
export class DeliveryTrackerService {
  private readonly url = 'https://delivery-track.pickk.one/api/carriers';

  constructor(private readonly httpService: HttpService) {}

  async getTrackInfo(
    courierCode: string,
    trackCode: string
  ): Promise<TrackDeliveryDto> {
    const { data } = await firstValueFrom(
      this.httpService.get<TrackDeliveryDto>(
        `${this.url}/${courierCode}/tracks/${trackCode}`
      )
    );
    return data;
  }
}
