import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { CreateUserInput, UpdateUserInput } from './dto/user.input';
import { UserEntity } from './entities/user.entity';
import { User } from './models/user.model';
import { UserPassword } from './models/user-password.model';
import { ShippingAddress } from './models/shipping-address.model';
import {
  CreateShippingAddressInput,
  UpdateShippingAddressInput,
} from './dto/shipping-address.input';
import { ShippingAddressRepository } from './repositories/shipping-address.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(ShippingAddressRepository)
    private readonly shippingAddressRepository: ShippingAddressRepository
  ) {}

  async list(relations: string[] = []): Promise<UserEntity[]> {
    const users = await this.userRepository.find({ relations });
    return this.userRepository.entityToModelMany(users);
  }

  async get(id: number, relations: string[] = []): Promise<User> {
    return await this.userRepository.get(id, relations);
  }

  async create({ password, ...input }: CreateUserInput): Promise<UserEntity> {
    const user = new User(input);
    user.password = UserPassword.create(password);
    return await this.userRepository.save(user);
  }

  async update(id: number, input: UpdateUserInput): Promise<UserEntity> {
    const user = await this.userRepository.get(id);
    return await this.userRepository.updateEntity(user, input);
  }

  async findOne(
    param: Partial<UserEntity>,
    relations: string[] = []
  ): Promise<User | null> {
    return await this.userRepository.findOneEntity(param, relations);
  }

  async updatePassword(
    user: User,
    password: string,
    input: string
  ): Promise<User> {
    return await this.userRepository.save(user.updatePassword(password, input));
  }

  async getShippingAddresses(user: User): Promise<ShippingAddress[]> {
    const shippingAddresses =
      user.getShippingAddresses() ??
      (
        await this.userRepository.get(user.id, ['shippingAddresses'])
      ).getShippingAddresses();
    return shippingAddresses;
  }

  async addShippingAddress(
    user: User,
    createShippingAddressInput: CreateShippingAddressInput
  ): Promise<ShippingAddress[]> {
    user.addShippingAddress(createShippingAddressInput);
    return (await this.userRepository.save(user)).shippingAddresses;
  }

  async updateShippingAddress(
    user: User,
    addressId: number,
    updateShippingAddressInput: UpdateShippingAddressInput
  ): Promise<ShippingAddress> {
    user.updateShippingAddress(addressId, updateShippingAddressInput);
    return (await this.userRepository.save(user)).shippingAddresses.find(
      (address) => address.id === addressId
    );
  }

  async removeShippingAddress(
    user: User,
    addressId: number
  ): Promise<ShippingAddress[]> {
    user.removeShippingAddress(addressId);
    this.shippingAddressRepository.delete(addressId);
    return (await this.userRepository.save(user)).shippingAddresses;
  }
}
