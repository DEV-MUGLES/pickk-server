import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { CreateUserInput, UpdateUserInput } from './dto/user.input';
import { UserEntity } from './entities/user.entity';
import { User } from './models/user.model';
import { UserPassword } from './models/user-password.model';

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

  async get(id: number, relations: string[] = []): Promise<UserEntity> {
    return await this.usersRepository.get(id, relations);
  }

  async create({ password, ...input }: CreateUserInput): Promise<UserEntity> {
    const user = new User(input);
    user.password = new UserPassword().init(password);
    return await this.usersRepository.save(user);
  }

  async update(id: number, input: UpdateUserInput): Promise<UserEntity> {
    const user = await this.usersRepository.get(id);
    return await this.usersRepository.updateEntity(user, input);
  }

  async findOne(
    param: Partial<UserEntity>,
    relations: string[] = []
  ): Promise<User> {
    return await this.usersRepository.findOneEntity(param, relations);
  }
}
