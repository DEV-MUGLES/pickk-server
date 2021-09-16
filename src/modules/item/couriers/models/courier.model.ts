import { ObjectType } from '@nestjs/graphql';

import { CourierEntity } from '../entities';

@ObjectType()
export class Courier extends CourierEntity {}
