import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Socket,Namespace } from "socket.io";
import { SocketWithAuth } from 'src/auth/auth-extensions';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Logger } from '@nestjs/common';


@WebSocketGateway({
  namespace:'companies',
})
export class CompaniesGateway implements OnGatewayConnection,OnGatewayDisconnect,OnGatewayInit {
  constructor(private readonly companiesService: CompaniesService, private readonly userService: UsersService) {}
  private readonly logger = new Logger(CompaniesGateway.name);


  @WebSocketServer()
  io: Namespace;
 
  afterInit() {
    this.logger.log("Companies Gateaway initialised");
  }

  async handleConnection(client: SocketWithAuth) {
    await this.matchClientToCompanyRoom(client);
  }

  handleDisconnect() {
    return;
  }


  @SubscribeMessage('createCompany')
  async create(@MessageBody() createCompanyDto: CreateCompanyDto , @ConnectedSocket() client: SocketWithAuth){
    return await this.companiesService.create(client.userId, createCompanyDto);
  }

  @SubscribeMessage('findOneCompany')
  async findOne(@MessageBody() id: string) {
    return this.companiesService.findOne(id);
  }

  @SubscribeMessage('updateCompany')
  async update(@MessageBody() updateCompanyDto: UpdateCompanyDto, @ConnectedSocket() client : SocketWithAuth) {
    const updatedCompany =  await this.companiesService.update(updateCompanyDto);
    this.emitMessageToRoom(client,"updatedCompany",updatedCompany);
  }

  @SubscribeMessage('removeCompany')
  async remove(@MessageBody() companyId: string,@ConnectedSocket() client: SocketWithAuth,) {
    this.io.in(companyId).disconnectSockets();
    return await this.companiesService.remove(client.id, companyId);
  }
  
  @SubscribeMessage('joinCompany')
  async joinCompany(@MessageBody() shareKey: string, @ConnectedSocket() client: SocketWithAuth,){
    await this.companiesService.joinCompany(client.userId,shareKey);
    this.matchClientToCompanyRoom(client);
    
  }

  @SubscribeMessage('removeUser')
  async removeUser(@MessageBody() userToRemoveId ,@ConnectedSocket() client: SocketWithAuth,){
    await this.companiesService.removeUserFromCompany(client.userId,userToRemoveId);
    client.leave(client.data['company']);

  }

  emitMessageToRoom(client : SocketWithAuth, message: string, body : any){
    client.in(client.data["company"]).emit((message),body);
  }

  async matchClientToCompanyRoom(client : SocketWithAuth ){
    const user: User = await this.userService.findOne(client.userId);
    if(user.company != null){
      client.join(user.company.id); 
      client.data["company"] = user.company.id;
    }
  }

}
