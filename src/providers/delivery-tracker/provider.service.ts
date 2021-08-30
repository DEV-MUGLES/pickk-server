import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import dayjs from 'dayjs';
import { firstValueFrom } from 'rxjs';

import { IShipmentHistory } from '@order/shipments/interfaces';

import { TrackDeliveryDto } from './dtos';

@Injectable()
export class DeliveryTrackerService {
  private readonly url = 'https://delivery-track.pickk.one/api/carriers';

  constructor(private readonly httpService: HttpService) {}

  async trackHistory(
    courierCode: string,
    trackCode: string
  ): Promise<Pick<IShipmentHistory, 'time' | 'statusText' | 'locationName'>[]> {
    const {
      data: { progresses },
    } = await firstValueFrom(
      this.httpService.get<TrackDeliveryDto>(
        `${this.url}/${courierCode}/tracks/${trackCode}`
      )
    );

    return progresses
      .map(({ time, status, location }) => ({
        time,
        statusText: status.text,
        locationName: location.name,
      }))
      .sort((a, b) => (dayjs(a.time).isAfter(dayjs(b.time)) ? 1 : -1));
  }
}
