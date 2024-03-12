import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesGateway } from './companies.gateway';

@Module({
  providers: [CompaniesGateway, CompaniesService],
})
export class CompaniesModule {}
