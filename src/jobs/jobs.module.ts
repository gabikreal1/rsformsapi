import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsGateway } from './jobs.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Company } from 'src/companies/entities/company.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job,Company]),UsersService],
  providers: [JobsGateway, JobsService],

})
export class JobsModule {}
