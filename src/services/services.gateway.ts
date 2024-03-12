import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@WebSocketGateway()
export class ServicesGateway {
  constructor(private readonly servicesService: ServicesService) {}

  @SubscribeMessage('createService')
  create(@MessageBody() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @SubscribeMessage('findAllServices')
  findAll() {
    return this.servicesService.findAll();
  }

  @SubscribeMessage('findOneService')
  findOne(@MessageBody() id: number) {
    return this.servicesService.findOne(id);
  }

  @SubscribeMessage('updateService')
  update(@MessageBody() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(updateServiceDto.id, updateServiceDto);
  }

  @SubscribeMessage('removeService')
  remove(@MessageBody() id: number) {
    return this.servicesService.remove(id);
  }
}
