import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesGateway } from './companies.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company]),UsersService],
  providers: [CompaniesGateway, CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
