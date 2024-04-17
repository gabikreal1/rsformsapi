import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { retry } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager:EntityManager){}

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(createUserDto);
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOne({relations:{company:true},where:{id:id}});
  }

  

  async update( updateUserDto: UpdateUserDto) {
    return await this.usersRepository.save(updateUserDto);
  }

  

  async remove(id: string) {
    return await this.usersRepository.delete(id);
  }

}
