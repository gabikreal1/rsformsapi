import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesGateway } from './services.gateway';

@Module({
  providers: [ServicesGateway, ServicesService],
})
export class ServicesModule {}
