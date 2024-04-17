import { Module } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { PicturesGateway } from './pictures.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Picture } from './entities/picture.entity';

@Module({

  imports: [TypeOrmModule.forFeature([Picture])],
  providers: [PicturesGateway, PicturesService],
})
export class PicturesModule {}
