import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { CreateUserInput, UpdateUserInput } from './dto/user.input';
import { User } from './models/user.model';
import { UserPassword } from './models/user-password.model';
import { ShippingAddress } from './models/shipping-address.model';
import {
  CreateShippingAddressInput,
  UpdateShippingAddressInput,
} from './dto/shipping-address.input';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  async list(relations: string[] = []): Promise<User[]> {
    const users = await this.usersRepository.find({ relations });
    return this.usersRepository.entityToModelMany(users);
  }

  async get(id: number, relations: string[] = []): Promise<User> {
    return await this.usersRepository.get(id, relations);
  }

  async create({ password, ...input }: CreateUserInput): Promise<User> {
    const user = new User(input);
    user.password = UserPassword.create(password);
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
}
