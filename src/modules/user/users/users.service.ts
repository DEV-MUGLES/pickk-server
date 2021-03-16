import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { CreateUserInput, UpdateUserInput } from './dto/user.input';
import { UserEntity } from './entities/user.entity';
import { User } from './models/user.model';
import { UserPassword } from './models/user-password.model';
import { ShippingAddress } from './models/shipping-address.model';
import { CreateShippingAddressInput } from './dto/shipping-address.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  async list(relations: string[] = []): Promise<UserEntity[]> {
    const users = await this.usersRepository.find({ relations });
    return this.usersRepository.entityToModelMany(users);
  }

  async get(id: number, relations: string[] = []): Promise<User> {
    return await this.usersRepository.get(id, relations);
  }

  async create({ password, ...input }: CreateUserInput): Promise<UserEntity> {
    const user = new User(input);
    user.password = UserPassword.create(password);
    return await this.usersRepository.save(user);
  }

  async update(id: number, input: UpdateUserInput): Promise<UserEntity> {
    const user = await this.usersRepository.get(id);
    return await this.usersRepository.updateEntity(user, input);
  }

  async findOne(
    param: Partial<UserEntity>,
    relations: string[] = []
  ): Promise<User | null> {
    return await this.usersRepository.findOneEntity(param, relations);
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
}
