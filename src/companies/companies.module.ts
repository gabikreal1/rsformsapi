import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesGateway } from './companies.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  providers: [CompaniesGateway, CompaniesService],
})
export class CompaniesModule {}
