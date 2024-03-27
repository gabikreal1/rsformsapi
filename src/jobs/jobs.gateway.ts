import { WebSocketGateway, SubscribeMessage, MessageBody , WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, ConnectedSocket} from '@nestjs/websockets';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Logger, OnModuleInit } from "@nestjs/common";
import { Socket,Namespace } from "socket.io";
import { Job } from './entities/job.entity';

@WebSocketGateway({
  namespace:'jobs',
})
export class JobsGateway implements OnGatewayConnection,OnGatewayDisconnect,OnGatewayInit{
  private readonly logger = new Logger(JobsGateway.name);
  constructor(private readonly jobsService: JobsService) {}
  private socketToRoomMap = {};
  
  @WebSocketServer()
  io: Namespace;


  afterInit(): void {
    this.logger.log("Jobs Gateway initialised.");
  }
 
  handleConnection(client: Socket) {
    const sockets = this.io.sockets;
    
    this.logger.log(`WebSocket Client with id: ${client.data['user'].id} connected.`);
    this.logger.log(`Amount of connected sockets: ${sockets.size}`)

  }
  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;
    this.logger.log(`WebSocket Client with id: ${client.id} connected.`);
    this.logger.log(`Amount of connected sockets: ${sockets.size}`)
    
  }

  
  @SubscribeMessage('createJob')
  async create( @MessageBody() createJobDto: CreateJobDto,
                @ConnectedSocket() client: Socket,      
  ): Promise<void> {
    const createdJob : Job = await this.jobsService.create(createJobDto);
    
    client.rooms.forEach((room) => {
      this.io.in(room).emit(("jobCreated"),createdJob);
    })
    
    
  }

  @SubscribeMessage('findAllJobs')
  findAll() {
    return this.jobsService.findAll();
  }

  @SubscribeMessage('findOneJob')
  findOne(@MessageBody() id: number) {
    return this.jobsService.findOne(id);
  }

  @SubscribeMessage('updateJob')
  update(@MessageBody() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(updateJobDto.id, updateJobDto);
  }

  @SubscribeMessage('removeJob')
  remove(@MessageBody() id: number) {
    return this.jobsService.remove(id);
  }
}
