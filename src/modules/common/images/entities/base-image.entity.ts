import { AbstractImageEntity } from '@src/common/entities/image.entity';
import { Entity } from 'typeorm';

@Entity('base_image')
export class BaseImageEntity extends AbstractImageEntity {}
