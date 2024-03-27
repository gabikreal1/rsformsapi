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
    
    const company = new Company(createCompanyDto);
    
    return await this.entityManager.save(company);
  }



  async findOne(id: string) {
    const res =  await this.companiesRepository.findOneBy({id});
    return res;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {

    return await this.entityManager.update(Company,id,updateCompanyDto);
  }

  async remove(id: string) {
    return await this.entityManager.delete(Company,id);
  }
}
