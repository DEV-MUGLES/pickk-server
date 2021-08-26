import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { DeliveryTrackInfoDto } from './dtos';

@Injectable()
export class DeliveryTrackerService {
  private readonly url = 'https://delivery-track.pickk.one/api/carriers';

  constructor(private readonly httpService: HttpService) {}

  async track(
    courierCode: string,
    trackCode: string
  ): Promise<DeliveryTrackInfoDto> {
    const { data } = await firstValueFrom(
      this.httpService.get<DeliveryTrackInfoDto>(
        `${this.url}/${courierCode}/tracks/${trackCode}`
      )
    );
    return data;
  }
}
