import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsGateway } from './jobs.gateway';

@Module({
  providers: [JobsGateway, JobsService],
})
export class JobsModule {}
