import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { SocketWithAuth } from 'src/auth/auth-extensions';
import { Service } from './entities/service.entity';
import { Namespace} from 'socket.io';

@WebSocketGateway({ namespace: 'services' })
export class ServicesGateway {
  constructor(private readonly servicesService: ServicesService) {}

  @WebSocketServer()
  io: Namespace

  @SubscribeMessage('createService')
  async create(@MessageBody() createServiceDto: CreateServiceDto,@ConnectedSocket() client : SocketWithAuth) {
    const services: Service[] = await this.servicesService.create(createServiceDto);
    this.emitMessageToRoom(client,"serviceCreated",services);
  }


  @SubscribeMessage('findAllServices')
  async findAll(@MessageBody() jobId ,@ConnectedSocket() client: SocketWithAuth): Promise<Service[]> {
    return this.servicesService.findAll(jobId);
  }

  @SubscribeMessage('updateService')
  async update(@MessageBody() updateServiceDto: UpdateServiceDto,@ConnectedSocket() client: SocketWithAuth) {
    const services : Service[] = await this.servicesService.update(updateServiceDto);
    this.emitMessageToRoom(client,"serviceUpdated",services);
  }

  @SubscribeMessage('removeService')
  async remove(@MessageBody() serviceId: string, @ConnectedSocket() client: SocketWithAuth ) {
    const services: Service[]= await this.servicesService.remove(serviceId);
    this.emitMessageToRoom(client,"serviceRemoved",services);
  }

  /// Create a new typedef with jobId payload for services namespace

  emitMessageToRoom(client: SocketWithAuth, message: string, body: any) {
    this.io.in(client.data['jobId']).emit(message, body);
  }

  @SubscribeMessage('leaveRoom')
  async removeClientFromRoom(@ConnectedSocket() client: SocketWithAuth){
    client.leave(client.data["jobId"]);
    client.data["jobId"] = "";
  }

  @SubscribeMessage('joinRoom')
  async matchClientToServiceRoom(@MessageBody()  jobId: string,@ConnectedSocket() client : SocketWithAuth) {
    client.data["jobId"] = jobId;
    client.join(client.data["jobId"]);
  }

}
