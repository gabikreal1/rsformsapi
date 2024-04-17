import { Injectable, Logger } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    private readonly entityManager:EntityManager){}


  async create(creatorId: string, createCompanyDto: CreateCompanyDto)  {
    createCompanyDto.ownerUserId = creatorId;
    const company: Company = await this.companiesRepository.save(createCompanyDto);
    await this.addUserToCompany(creatorId,company.id);
    return company;    
  }

  async findOne(id: string) {
    return await this.entityManager.findOne(Company,{where:{id},relations:{users:true}});
  }

  async update(updateCompanyDto: UpdateCompanyDto): Promise<Company>  {
    return await this.companiesRepository.save(updateCompanyDto);
  }

  async joinCompany(userId : string , shareKey: string): Promise<void>  {
    const company = await this.companiesRepository.findOneBy({shareKey}).catch((reason) => {return reason;});
    await this.addUserToCompany(userId,company.id);
  }

  async addUserToCompany(userId: string, companyId : string): Promise<void> {
    const user : User = await this.entityManager.findOneBy(User,{id:userId});
    if(user.company == null){
      const company : Company = await this.findOne(companyId);
      company.users.push(user);
      this.companiesRepository.update(companyId,company);
    }
  }

  async removeUserFromCompany(requestUserId: string, userToRemoveId:string){
    const user : User = await this.entityManager.findOneBy(User,{id:userToRemoveId});
    if(user.company == null){
      return
    }
    const company: Company =  user.company;
    if(company.ownerUserId == requestUserId || userToRemoveId == requestUserId){
      user.company = null;
      return await this.entityManager.update(User, user.id, user);
    } 
    return;
  }

  

  async remove(userId: string, companyId: string): Promise<void> {
    if(await this.checkIfUserIsOwnerOfCompany(userId,companyId)){
      await this.companiesRepository.delete(companyId);
    }
  }
  

  async checkIfUserIsOwnerOfCompany(userId:string,companyId: string ): Promise<Boolean>{
    const company: Company = await this.companiesRepository.findOneBy({id:companyId});
    return userId == company.ownerUserId;
  }
}
