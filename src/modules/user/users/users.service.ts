import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { enrichIsMe, parseFilter } from '@common/helpers';

import { FollowsService } from '@user/follows/follows.service';

import {
  CreateUserInput,
  UpdateUserInput,
  CreateShippingAddressInput,
  UpdateShippingAddressInput,
  CreateRefundAccountInput,
  UpdateRefundAccountInput,
  UserFilter,
} from './dtos';
import { UserEntity } from './entities';
import { User, UserPassword, ShippingAddress, RefundAccount } from './models';

import {
  ShippingAddressesRepository,
  UsersRepository,
} from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @InjectRepository(ShippingAddressesRepository)
    private readonly shippingAddressesRepository: ShippingAddressesRepository,
    private readonly followsService: FollowsService
  ) {}

  async get(
    id: number,
    relations: string[] = [],
    userId?: number
  ): Promise<User> {
    const user = await this.usersRepository.get(id, relations);

    enrichIsMe(userId, user);
    await this.followsService.enrichFollowing(userId, user);

    return user;
  }

  async getShippingAddress(id: number): Promise<ShippingAddress> {
    return await this.shippingAddressesRepository.get(id);
  }

  async list(
    filter?: UserFilter,
    pageInput?: PageInput,
    relations: string[] = []
  ): Promise<User[]> {
    const _filter = plainToClass(UserFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.usersRepository.entityToModelMany(
      await this.usersRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
        order: {
          [filter.orderBy ?? 'id']: 'DESC',
        },
      })
    );
  }

  async getNicknameOnly(id: number): Promise<Pick<User, 'id' | 'nickname'>> {
    return await this.usersRepository.getNicknameOnly(id);
  }

  async create({ password, ...input }: CreateUserInput): Promise<User> {
    const user = new User(input);
    if (password) {
      user.password = UserPassword.of(password);
    }
    return await this.usersRepository.save(user);
  }

  async update(id: number, input: UpdateUserInput): Promise<void> {
    if (input.styleTagIds != null) {
      await this.usersRepository.updateStyleTagRelations(id, input.styleTagIds);
    }

    const user = await this.get(id);
    await this.usersRepository.save(new User({ ...user, ...input }));
  }

  async findOne(
    param: Partial<UserEntity>,
    relations: string[] = []
  ): Promise<User | null> {
    return await this.usersRepository.findOneEntity(param, relations);
  }

  async updatePassword(
    user: User,
    password: string,
    input: string
  ): Promise<User> {
    return await this.usersRepository.save(
      user.updatePassword(password, input)
    );
  }

  async listShippingAddress(userId: number): Promise<ShippingAddress[]> {
    return await this.shippingAddressesRepository.find({
      where: { userId },
    });
  }

  async addShippingAddress(
    userId: number,
    createShippingAddressInput: CreateShippingAddressInput
  ): Promise<ShippingAddress> {
    const user = await this.get(userId, ['shippingAddresses']);
    user.addShippingAddress(createShippingAddressInput);

    const { shippingAddresses } = await this.usersRepository.save(user);

    return shippingAddresses[shippingAddresses.length - 1];
  }

  async updateShippingAddress(
    userId: number,
    addressId: number,
    input: UpdateShippingAddressInput
  ): Promise<ShippingAddress> {
    const user = await this.get(userId, ['shippingAddresses']);
    user.updateShippingAddress(addressId, input);

    return (await this.usersRepository.save(user)).shippingAddresses.find(
      (address) => address.id === addressId
    );
  }

  async removeShippingAddress(
    user: User,
    addressId: number
  ): Promise<ShippingAddress[]> {
    const deletedShippingAddress = user.removeShippingAddress(addressId);
    deletedShippingAddress.remove();
    return (await this.usersRepository.save(user)).shippingAddresses;
  }

  async addRefundAccount(
    user: User,
    createRefundAccountInput: CreateRefundAccountInput
  ): Promise<RefundAccount> {
    user.addRefundAccount(createRefundAccountInput);
    return (await this.usersRepository.save(user)).refundAccount;
  }

  async updateRefundAccount(
    user: User,
    updateRefundAccountInput: UpdateRefundAccountInput
  ): Promise<RefundAccount> {
    user.updateRefundAccount(updateRefundAccountInput);
    return (await this.usersRepository.save(user)).refundAccount;
  }

  async removeRefundAccount(user: User): Promise<User> {
    const deleted = user.removeRefundAccount();
    deleted.remove();
    return await this.usersRepository.save(user);
  }

  async checkUserExist(nickname: string): Promise<boolean> {
    return await this.usersRepository.checkExist(nickname);
  }
}
