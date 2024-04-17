import { WebSocketGateway, SubscribeMessage, MessageBody , WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, ConnectedSocket} from '@nestjs/websockets';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Logger } from "@nestjs/common";
import { Namespace } from "socket.io";
import { SocketWithAuth } from 'src/auth/auth-extensions';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  namespace:'jobs',
})
export class JobsGateway implements OnGatewayConnection,OnGatewayDisconnect,OnGatewayInit{
  constructor(private readonly jobsService: JobsService, private readonly userService: UsersService) {}
  private readonly logger = new Logger(JobsGateway.name);

  
  @WebSocketServer()
  io: Namespace;


  afterInit(): void {
    this.logger.log("Jobs Gateway initialised.");
  }
 
  async handleConnection(client: SocketWithAuth)  {
    
    try{
      const companyId : string = (await this.userService.findOne(client.userId)).company.id;
      client.join(companyId);
      client.data['company'] = companyId;
    }
    catch{
      client.send("user-company-relation-empty");
      client.disconnect();
    }    

  }

  handleDisconnect(client: SocketWithAuth) {
    return;
  }

  
  @SubscribeMessage('createJob')
  async create( @MessageBody() createJobDto: CreateJobDto,
                @ConnectedSocket() client: SocketWithAuth,): Promise<void> {

    const createdJob = await this.jobsService.create(createJobDto);
    this.emitMessageToRoom(client,"createdJob",createdJob);

  }

  @SubscribeMessage('findOneJob')
  findOne(@MessageBody() id: string) {
    return this.jobsService.findOne(id);
  }

  @SubscribeMessage('findLatestJobs')
  async findLatestJobs(@MessageBody() lastUpdatedTime: number ){
    return await this.jobsService.findLatestJobs(lastUpdatedTime);
    
  }


  @SubscribeMessage('updateJob')
  async update(@MessageBody() updateJobDto: UpdateJobDto, @ConnectedSocket() client: SocketWithAuth) {
    const updatedJob = await this.jobsService.update(updateJobDto.id,updateJobDto);
    this.emitMessageToRoom(client,"updatedJob",updatedJob);

  }

  @SubscribeMessage('removeJob')
  async remove(@MessageBody() id: string,@ConnectedSocket() client: SocketWithAuth ) {

    const removedJob = await this.jobsService.remove(id);
    this.emitMessageToRoom(client,"removedJob",removedJob);
    
  }

  emitMessageToRoom(client: SocketWithAuth,message: string, body: any){
    client.in(client.data['company']).emit((message),body);
  }
}
