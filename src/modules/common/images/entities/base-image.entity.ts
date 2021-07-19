import { Entity } from 'typeorm';

import { AbstractImageEntity } from '@common/entities';

@Entity('base_image')
export class BaseImageEntity extends AbstractImageEntity {}
