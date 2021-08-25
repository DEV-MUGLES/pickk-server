import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

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

import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

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

  async get(id: number, relations: string[] = []): Promise<User> {
    return await this.usersRepository.get(id, relations);
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

  async update(id: number, input: UpdateUserInput): Promise<User> {
    await this.usersRepository.update(id, input);
    return await this.get(id);
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

  async getShippingAddresses(user: User): Promise<ShippingAddress[]> {
    const shippingAddresses =
      user.getShippingAddresses() ??
      (
        await this.usersRepository.get(user.id, ['shippingAddresses'])
      ).getShippingAddresses();
    return shippingAddresses;
  }

  async addShippingAddress(
    user: User,
    createShippingAddressInput: CreateShippingAddressInput
  ): Promise<ShippingAddress[]> {
    user.addShippingAddress(createShippingAddressInput);
    return (await this.usersRepository.save(user)).shippingAddresses;
  }

  async updateShippingAddress(
    user: User,
    addressId: number,
    updateShippingAddressInput: UpdateShippingAddressInput
  ): Promise<ShippingAddress> {
    user.updateShippingAddress(addressId, updateShippingAddressInput);
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
