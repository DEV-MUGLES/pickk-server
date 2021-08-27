import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { ShipmentHistoriesRepository } from '@order/shipments/shipments.repository';

@Injectable()
export class RemoveNotReferedShipmentHistoriesStep extends BaseStep {
  constructor(
    @InjectRepository(ShipmentHistoriesRepository)
    private readonly shipmentHistoriesRepository: ShipmentHistoriesRepository
  ) {
    super();
  }
  async tasklet(): Promise<void> {
    const notReferedHistories = await this.shipmentHistoriesRepository.find({
      where: { shipmentId: null },
    });

    await this.shipmentHistoriesRepository.remove(notReferedHistories);
  }
}
