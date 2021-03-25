import { Entity } from 'typeorm';

import { AbstractImageEntity } from '@src/common/entities/image.entity';

@Entity({
  name: 'user_avatar_image',
})
export class UserAvatarImageEntity extends AbstractImageEntity {}
