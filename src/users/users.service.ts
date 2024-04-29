import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(createUserDto);
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOne({
      relations: { company: true },
      where: { id: id },
    });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.usersRepository.save(updateUserDto);
  }
}
