/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Logger } from '@nestjs/common';
import { Namespace } from 'socket.io';
import { SocketWithAuth } from 'src/auth/auth-extensions';
import { UsersService } from 'src/users/users.service';
import { Job } from './entities/job.entity';
import { Picture } from './entities/picture.entity';

@WebSocketGateway({
  namespace: 'jobs',
})
export class JobsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly jobsService: JobsService,
    private readonly userService: UsersService,
  ) {}
  private readonly logger = new Logger(JobsGateway.name);

  @WebSocketServer()
  io: Namespace;

  afterInit(): void {
    this.logger.log('Jobs Gateway initialised.');
  }

  async handleConnection(client: SocketWithAuth) {
    try {
      const companyId: string = (await this.userService.findOne(client.userId))
        .company.id;
      await client.join(companyId);
    
    } catch {
      client.send('user-company-relation-empty');
      client.disconnect();
    }
  }
  handleDisconnect(client: SocketWithAuth) {
    return;
  }
  async getCompanyOutOfSocket(client: SocketWithAuth){
    if(client.data["company"] == null){
      client.data["company"]= (await this.userService.findOne(client.userId))
        .company.id;
    }
    return client.data["company"];
  }


  @SubscribeMessage('createJob')
  async create(
    @MessageBody() createJobDto: CreateJobDto,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    
    const createdJob: Job = await this.jobsService.create(
      createJobDto,
      (await this.userService.findOne(client.userId))
    .company);
    this.emitMessageToRoom(client, 'createdJob', [createdJob]);
  }

  @SubscribeMessage('findLatestJobs')
  async findLatestJobs(@MessageBody() lastUpdatedTime: number,@ConnectedSocket() client : SocketWithAuth) {
    return await this.jobsService.findLatestJobs(lastUpdatedTime,client.data["company"]);
  }

  @SubscribeMessage('findAllJobs')
  async findAllJobs(@ConnectedSocket() client: SocketWithAuth){
    
    return await this.jobsService.findAllJobs(await this.getCompanyOutOfSocket(client));
  }

  @SubscribeMessage('updateJob')
  async update(
    @MessageBody() updateJobDto: UpdateJobDto,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    const updatedJob: Job = await this.jobsService.update(updateJobDto);
   await this.emitMessageToRoom(client, 'updatedJob', [updatedJob]);
  }

  @SubscribeMessage('removeJob')
  async remove(
    @MessageBody() id: string,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    const removedJob = await this.jobsService.remove(id);
    this.emitMessageToRoom(client, 'removedJob', [removedJob]);
  }
  
  @SubscribeMessage('fetchAllPictures')
  async fetchAllPictures(
    @MessageBody() jobID :string,
    ){
      return await this.jobsService.fetchAllPictures(jobID);
    }
    
  @SubscribeMessage('addPicture')
  async addPicture(
    @MessageBody() jobID :string,
    ){
      return (await this.jobsService.addPicture(jobID)).id;
    }

  async emitMessageToRoom(client: SocketWithAuth, message: string, body: any)  {
    this.io.in(await this.getCompanyOutOfSocket(client)).emit(message, body);
  }
}
