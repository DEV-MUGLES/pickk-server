import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  async list(relations: string[] = []): Promise<User[]> {
    const users = await this.usersRepository.find({ relations });
    return this.usersRepository.transformMany(users);
  }

  async get(id: number, relations: string[] = []): Promise<User> {
    return await this.usersRepository.get(id, relations);
  }

  async create(inputs: CreateUserDto): Promise<User> {
    return await this.usersRepository.createEntity(inputs);
  }

  async update(id: number, inputs: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.get(id);
    return await this.usersRepository.updateEntity(user, inputs);
  }

  async findOne(param: Partial<User>, relations: string[] = []): Promise<User> {
    return await this.usersRepository.findOneEntity(param, relations);
  }
}
