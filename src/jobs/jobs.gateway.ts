import { WebSocketGateway, SubscribeMessage, MessageBody , WebSocketServer} from '@nestjs/websockets';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { OnModuleInit } from "@nestjs/common";
import { Server } from "socket.io";

@WebSocketGateway()
export class JobsGateway {
  constructor(private readonly jobsService: JobsService) {}

  @WebSocketServer()
  server: Server

  onModuleInit() {
      this.server.on('connection',(socket) =>{
          console.log(socket.id);
          console.log("Connected");
      })
  }



  @SubscribeMessage('createJob')
  create(@MessageBody() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
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
