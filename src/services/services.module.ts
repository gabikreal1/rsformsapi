import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesGateway } from './services.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service,Job])],
  providers: [ServicesGateway, ServicesService],
})
export class ServicesModule {}
