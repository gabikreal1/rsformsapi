import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, MoreThanOrEqual, Repository } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { SocketWithAuth } from 'src/auth/auth-extensions';
import { Picture } from './entities/picture.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobsRepository: Repository<Job>,
    private readonly entityManager: EntityManager,
  ) {}


  async create(createJobDto: CreateJobDto,company : Company) {
    createJobDto.lastUpdatedTime = Date.now();
    const job : Job = this.jobsRepository.create(createJobDto);
    job.company = company;
    return await this.jobsRepository.save(job);
  }

  async findOne(id: string) {
    return await this.jobsRepository.findOneBy({ id: id });
  }

  async findLatestJobs(lastUpdatedTime: number, companyId : string) {
    const company : Company = await  this.entityManager.findOneBy(Company,{id:companyId});
    return await this.jobsRepository.find({
      where: { lastUpdatedTime: MoreThanOrEqual(lastUpdatedTime),company:company},
    });
  }
  async findAllJobs(companyId : string) {
    console.log(companyId);
    

    const queryBuilder = this.jobsRepository.createQueryBuilder('job')
    .leftJoinAndSelect('job.company', 'company')
    .where('company.id = :companyId', { companyId: companyId });

    const company: Company = await this.entityManager.findOne(Company,{where:{id:companyId},relations:{jobs:true}});
    const res = (await this.entityManager.findOne(Company,{where:{id:companyId},relations:{jobs:true}})).jobs;
    console.log(res)
    console.log(company)
    return res
  }

  async update(updateJobDto: UpdateJobDto) {
    updateJobDto.lastUpdatedTime = Date.now();
    return await this.jobsRepository.save(updateJobDto);
  }

  async remove(id: string) {
    const job: Job = await this.jobsRepository.findOneBy({ id });
    job.removed = true;
    job.lastUpdatedTime = Date.now();

    return await this.jobsRepository.save(job);
  }


  /// Could've been anouther gateway, But job and pictures are closely related
  async fetchAllPictures(jobId) : Promise<string[]> {
    var response: string[] = [];
    (await this.jobsRepository.findOne({where:{id:jobId},relations:{pictures:true} })).pictures.forEach((picture: Picture ) => {response.push(picture.id)});
    return response;
  }
  async addPicture(jobId :string){
    const job: Job =  await this.jobsRepository.findOne({where:{id:jobId},relations:{pictures:true}});
    const picture: Picture = await this.entityManager.create(Picture);
    picture.job = job;
    return await this.entityManager.save(Picture,picture);
  }
}
