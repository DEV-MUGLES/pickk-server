import { Injectable } from '@nestjs/common';
import { EntityTarget, getManager } from 'typeorm';

@Injectable()
export abstract class BaseSeeder {
  abstract seed(): Promise<void>;
  protected async findEntities<Entity>(
    entity: EntityTarget<Entity>
  ): Promise<Entity[]> {
    return await getManager().find(entity);
  }
}
