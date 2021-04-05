import { Module } from '@nestjs/common';
import AdminBro from 'admin-bro';
import { AdminModule as AdminBroModule } from '@admin-bro/nestjs';
import { Database, Resource } from '@admin-bro/typeorm';

import { UserEntity } from '@src/modules/user/users/entities/user.entity';
import { BrandEntity } from '@src/modules/item/brands/entities/brand.entity';
import { CourierEntity } from '@src/modules/item/couriers/entities/courier.entity';
import { ItemProfileEntity } from '@src/modules/item/item-profiles/entities/item-profile.entity';
import { AuthModule } from '@src/authentication/auth.module';
import { AuthService } from '@src/authentication/auth.service';
import { UserRole } from '@src/modules/user/users/constants/user.enum';
import { UserAvatarImageEntity } from '@src/modules/user/users/entities/user-avatar-image.entity';
import { ShippingAddressEntity } from '@src/modules/user/users/entities/shipping-address.entity';
import { ItemThumbnailImageEntity } from '@src/modules/item/item-profiles/entities/item-thumbnail-image.entity';

AdminBro.registerAdapter({ Database, Resource });

@Module({
  imports: [
    AuthModule,
    AdminBroModule.createAdminAsync({
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: (authService: AuthService) => ({
        adminBroOptions: {
          rootPath: '/admin',
          resources: [
            UserEntity,
            UserAvatarImageEntity,
            ShippingAddressEntity,
            BrandEntity,
            CourierEntity,
            ItemProfileEntity,
            ItemThumbnailImageEntity,
          ],
        },
        auth: {
          authenticate: async (code: string, password: string) => {
            try {
              const user = await authService.getUserByCodeAuth(code, password);

              return user?.role === UserRole.Admin
                ? { ...user, id: user.id.toString() }
                : null;
            } catch {
              return null;
            }
          },
          cookieName: 'test',
          cookiePassword: 'testPassword',
        },
      }),
    }),
  ],
})
export class AdminModule {}
