import { Injectable, Logger } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { EntityManager, Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    private readonly entityManager:EntityManager){}


  async create(createCompanyDto: CreateCompanyDto)  {
    return await this.companiesRepository.save(createCompanyDto);
  }

  async findOne(id: string) {
    return await this.companiesRepository.findOneBy({id});
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {

    return await this.companiesRepository.update(id,updateCompanyDto);
  }

  async remove(id: string) {
     await this.companiesRepository.delete(id);
  }
}
