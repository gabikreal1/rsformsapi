import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsGateway } from './jobs.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Company } from 'src/companies/entities/company.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Picture } from './entities/picture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job,Company,User,Picture])],
  providers: [JobsGateway, JobsService, UsersService],

})
export class JobsModule {}
