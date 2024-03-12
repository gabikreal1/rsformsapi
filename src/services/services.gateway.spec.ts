import { Test, TestingModule } from '@nestjs/testing';
import { ServicesGateway } from './services.gateway';
import { ServicesService } from './services.service';

describe('ServicesGateway', () => {
  let gateway: ServicesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicesGateway, ServicesService],
    }).compile();

    gateway = module.get<ServicesGateway>(ServicesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
