import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesGateway } from './companies.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company,User,Job])],
  providers: [CompaniesGateway, CompaniesService,UsersService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
