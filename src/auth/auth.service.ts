import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SellerEntity } from '@item/sellers/entities';
import { Seller } from '@item/sellers/models';
import { SellersService } from '@item/sellers/sellers.service';
import { UserOauthProvider } from '@user/users/constants';
import { UserEntity } from '@user/users/entities';
import { User } from '@user/users/models';
import { UsersService } from '@user/users/users.service';
import { CacheService } from '@providers/cache/redis';

import { jwtRefreshConstants } from './constants';
import { CreateJwtPayloadInput } from './dtos';
import {
  PasswordIncorrectException,
  UserCodeNotFoundExeption,
  UserOauthNotFoundExeption,
} from './exceptions';
import { IJwtToken } from './interfaces';
import { Pin } from './models';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private sellersService: SellersService,
    private jwtService: JwtService,
    private cacheService: CacheService
  ) {}

  async createPinCode(userId: number, phoneNumber: string): Promise<string> {
    const { code } = Pin.create(userId, phoneNumber);

    const cacheKey = Pin.getCacheKey(userId, phoneNumber);
    await this.cacheService.set<string>(cacheKey, code);

    return code;
  }

    return pin;
  }
  async getUserByCodeAuth(
    code: string,
    password: string
  ): Promise<User | null> {
    const user = await this.usersService.findOne({ code });
    if (!user) {
      throw new UserCodeNotFoundExeption();
    }

    if (user.comparePassword(password)) {
      delete user.password;
      return user;
    } else {
      throw new PasswordIncorrectException();
    }
  }

  async getUserByOauth(
    oauthProvider: UserOauthProvider,
    oauthCode: string
  ): Promise<User | null> {
    const user = await this.usersService.findOne({ oauthProvider, oauthCode });
    if (!user) {
      throw new UserOauthNotFoundExeption();
    }

    delete user.password;
    return user;
  }

  getToken(user: Pick<UserEntity, 'id' | 'nickname'>): IJwtToken {
    const payload: CreateJwtPayloadInput = {
      nickname: user.nickname,
      sub: user.id,
    };
    return {
      access: this.jwtService.sign(payload),
      refresh: this.jwtService.sign(payload, jwtRefreshConstants),
    };
  }

  async getSellerByCodeAuth(
    code: string,
    password: string
  ): Promise<Seller | null> {
    const user = await this.usersService.findOne({ code });
    if (!user) {
      throw new UserCodeNotFoundExeption();
    }

    if (user.comparePassword(password)) {
      delete user.password;

      const seller = await this.sellersService.findOne({ userId: user.id }, [
        'brand',
        'user',
      ]);
      return seller;
    } else {
      throw new PasswordIncorrectException();
    }
  }

  getSellerToken(
    seller: Pick<SellerEntity, 'id' | 'brand' | 'user'>
  ): IJwtToken {
    const { user, brand } = seller;

    const payload: CreateJwtPayloadInput = {
      sellerId: seller.id,
      brandId: brand.id,
      nickname: user.nickname,
      sub: user.id,
    };
    return {
      access: this.jwtService.sign(payload),
      refresh: this.jwtService.sign(payload, jwtRefreshConstants),
    };
  }
}
