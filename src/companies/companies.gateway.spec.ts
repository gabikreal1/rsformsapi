import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesGateway } from './companies.gateway';
import { CompaniesService } from './companies.service';

describe('CompaniesGateway', () => {
  let gateway: CompaniesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompaniesGateway, CompaniesService],
    }).compile();

    gateway = module.get<CompaniesGateway>(CompaniesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
