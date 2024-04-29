import { Injectable, Logger } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { EntityManager, Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(creatorId: string, createCompanyDto: CreateCompanyDto) {
    createCompanyDto.ownerUserId = creatorId;
    const company: Company = this.companiesRepository.create(createCompanyDto);
    const res =  await this.companiesRepository.save(company);
    console.log(company);
    return await this.addUserToCompany(creatorId, res.id);
    
  }

  async findOne(id: string) {
    if(id == null || id == undefined){
      return;
    }
    var res=  await this.companiesRepository.findOne( {
      where: { id:id },
      relations: { users: true },
    });
    console.log(res)
    return res;
  }

  async update(updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    return await this.companiesRepository.save(updateCompanyDto);
  }
  //
  async joinCompany(userId: string, shareKey: string): Promise<Company> {
    console.log(shareKey);
    const company = await this.companiesRepository
      .findOneBy({ shareKey : shareKey })
      .catch((reason) => {
        return reason;
      });
    console.log(company);
    return await this.addUserToCompany(userId, company.id);
  }

  async addUserToCompany(userId: string, companyId: string): Promise<Company> {
    const user: User = await this.entityManager.findOneBy(User, { id: userId });
    console.log(user);
    if (user.company == null) {
      const company: Company = await this.findOne(companyId);
      console.log(company);
      if(company.users == null){
        company.users = [];
      }
      company.users.push(user);
      await this.companiesRepository.save(company);
      return this.companiesRepository.findOne({where:{id:company.id},relations:{users:true}});
    }

    return user.company;
  }

  async incrementInvoiceCounter(companyId: string){
    const company : Company = await this.companiesRepository.findOneBy({id:companyId});
    company.invoiceCounter += 1
    return await this.companiesRepository.save(company);
  } 


  async removeUserFromCompany(
    requestUserId: string,
    userToRemoveEmail: string,
  ): Promise<Company> {
    const user: User = await this.entityManager.findOne(User, {
      where: { email: userToRemoveEmail },
      relations: { company: true },
    });
    if (user.company == null) {
      return;
    }
    const company: Company = user.company;
    if (company.ownerUserId == requestUserId || user.id == requestUserId) {
      user.company = null;
      await this.entityManager.update(User, user.id, user);
      return this.companiesRepository.findOne({
        where: { id: company.id },
        relations: { users: true },
      });
    }
    return company;
  }


  async promoteUserToOwner(
    requestUserId : string,
    userToPromoteEmail:string,
  ){
    const user: User = await this.entityManager.findOne(User, {
      where: { email: userToPromoteEmail },
      relations: { company: true },
    });
    if (user.company == null) {
      return;
    }
    const company: Company = user.company;
    if (company.ownerUserId == requestUserId ) {
      company.ownerUserId = user.id;
      await this.entityManager.update(Company, company.id, company);
      return this.companiesRepository.findOne({
        where: { id: user.company.id },
        relations: { users: true },
      });
    }
    return company;


  }

  async remove(userId: string, companyId: string): Promise<void> {
    if (await this.checkIfUserIsOwnerOfCompany(userId, companyId)) {
      await this.companiesRepository.delete(companyId);
    }
  }

  async checkIfUserIsOwnerOfCompany(
    userId: string,
    companyId: string,
  ): Promise<boolean> {
    const company: Company = await this.companiesRepository.findOneBy({
      id: companyId,
    });
    return userId == company.ownerUserId;
  }
}
