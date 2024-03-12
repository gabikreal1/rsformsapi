import { Test, TestingModule } from '@nestjs/testing';
import { JobsGateway } from './jobs.gateway';
import { JobsService } from './jobs.service';

describe('JobsGateway', () => {
  let gateway: JobsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsGateway, JobsService],
    }).compile();

    gateway = module.get<JobsGateway>(JobsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
