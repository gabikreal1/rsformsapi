/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'src/jobs/entities/job.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly entityManager: EntityManager,
  ) {}


  async create(createServiceDto: CreateServiceDto) {
    const service: Service = this.serviceRepository.create(createServiceDto);
    service.job = await this.entityManager.findOneBy(Job,{id:createServiceDto.jobId});
     await this.serviceRepository.save(service);
    return (await this.entityManager.findOne(Job,{where:{id:createServiceDto.jobId},relations:{services:true,}})).services

  }

  async findAll(jobId: string) {
    return (await this.entityManager.findOne(Job,{where:{id:jobId},relations:{services:true}})).services;
  }

  async update( updateServiceDto: UpdateServiceDto) {
    const service: Service =  await this.serviceRepository.save(updateServiceDto);
    console.log(service);
    return (await this.entityManager.findOne(Job,{where:{id:updateServiceDto.jobId},relations:{services:true}})).services;

  }

  async remove(serviceId : string) {
    const service : Service = await this.serviceRepository.findOne({where:{id:serviceId},relations:{job:true}});
    await this.serviceRepository.delete(serviceId);
    return (await this.entityManager.findOne(Job,{where:{id:service.job.id},relations:{services:true}})).services;
    
  }
}
