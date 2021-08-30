import { Delete, Post, UseGuards } from '@nestjs/common';

import { SuperSecretGuard } from '@auth/guards';

import { JobsController } from '../decorators';

import { ShipmentJobsService } from './shipment-jobs.service';

@JobsController('shipment')
@UseGuards(SuperSecretGuard)
export class ShipmentJobsController {
  constructor(private readonly shipmentJobsService: ShipmentJobsService) {}

  @Post('/track-shipments')
  async trackShipments() {
    return await this.shipmentJobsService.trackShipments();
  }

  @Delete('/remove-not-refered-shipment-histories')
  async removeNotReferedShipmentHistories() {
    return await this.shipmentJobsService.removeNotReferedShipmentHistories();
  }
}
