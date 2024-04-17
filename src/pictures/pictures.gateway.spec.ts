import { Test, TestingModule } from '@nestjs/testing';
import { PicturesGateway } from './pictures.gateway';
import { PicturesService } from './pictures.service';

describe('PicturesGateway', () => {
  let gateway: PicturesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PicturesGateway, PicturesService],
    }).compile();

    gateway = module.get<PicturesGateway>(PicturesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
