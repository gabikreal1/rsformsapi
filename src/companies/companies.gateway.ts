import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Namespace } from 'socket.io';
import { SocketWithAuth } from 'src/auth/auth-extensions';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Logger } from '@nestjs/common';
import { Company } from './entities/company.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Column } from 'typeorm';
import { log } from 'console';

@WebSocketGateway({
  namespace: 'companies',
})
export class CompaniesGateway
  implements OnGatewayConnection, OnGatewayInit
{
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly userService: UsersService,
  ) {}
  private readonly logger = new Logger(CompaniesGateway.name);

  @WebSocketServer()
  io: Namespace;

  afterInit() {
    this.logger.log('Companies Gateaway initialised');
  }
  async handleConnection(client: SocketWithAuth) {
    this.logger.log(`Client connected ${client.userId}`);
    if ((await this.userService.findOne(client.userId)) == null) {
      console.log("here");
      const createUserDto: CreateUserDto = new CreateUserDto();
      createUserDto.id = client.userId;
      createUserDto.email = client.email;
      await this.userService.create(createUserDto);
      return;
    }
    await this.matchClientToCompanyRoom(client);
  }
  
  @SubscribeMessage('createCompany')
  async create(
    @MessageBody() createCompanyDto: CreateCompanyDto,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    console.log(createCompanyDto);
    const company: Company =  await this.companiesService.create(client.userId, createCompanyDto);
     await this.matchClientToCompanyRoom(client);
     return company;
  }

  @SubscribeMessage('findOneCompany')
  async findOne(@ConnectedSocket() client: SocketWithAuth) {
    if(client.data["company"] == undefined  || client.data["company"] == null){
      await this.matchClientToCompanyRoom(client);
      if (client.data["company"] == null){
        return "none";
      }
    }
    return this.companiesService.findOne(client.data['company']);
  }

  @SubscribeMessage('updateCompany')
  async update(
    @MessageBody() updateCompanyDto: UpdateCompanyDto,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    const updatedCompany: Company =
      await this.companiesService.update(updateCompanyDto);
      await this.emitMessageToRoom(client, 'updatedCompany', updatedCompany);
  }

  @SubscribeMessage('removeCompany')
  async remove(
    @MessageBody() companyId: string,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    this.io.in(companyId).disconnectSockets();
    return await this.companiesService.remove(client.id, companyId);
  }

  @SubscribeMessage('joinCompany')
  async joinCompany(
    @MessageBody() shareKey: string,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    const updatedCompany: Company = await this.companiesService.joinCompany(
      client.userId,
      shareKey,
    );
    await this.matchClientToCompanyRoom(client);
    await this.emitMessageToRoom(client, 'updatedCompany', updatedCompany);
  }

  @SubscribeMessage('removeUser')
  async removeUser(
    @MessageBody() userToRemoveEmail,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    
    const updatedCompany: Company =
      await this.companiesService.removeUserFromCompany(
        client.userId,
        userToRemoveEmail,
      );
      await this.emitMessageToRoom(client, 'updatedCompany', updatedCompany);
  }

  @SubscribeMessage("incrementInvoiceCounter")
  async incrementInvoiceCounter(
    @ConnectedSocket() client : SocketWithAuth
  ){
    if(client.data["company"] == undefined  || client.data["company"] == null){
      await this.matchClientToCompanyRoom(client);
    }
    const company: Company =  await this.companiesService.incrementInvoiceCounter(client.data["company"]);
    await this.emitMessageToRoom(client,"updatedCompany",company);
    return;
  }

  @SubscribeMessage("promoteUserToOwner")
  async promoteUserToOwner(
    @ConnectedSocket() client :SocketWithAuth,
    @MessageBody() emailToPromote : string,
  ){
    const company: Company =  await this.companiesService.promoteUserToOwner(client.id,emailToPromote);
    await this.emitMessageToRoom(client,"updatedCompany",company);
  }

  /// Not the best solution but was short in time :)
  /// Create a new typedef with companyId payload for companies namespace

  async emitMessageToRoom(client: SocketWithAuth, message: string, body: any)  {
    console.log(client.data["company"]);
    console.log((await this.io.in(client.data["company"]).fetchSockets()).length);
    this.io.in(client.data['company']).emit(message, body);
  }

  async matchClientToCompanyRoom(client: SocketWithAuth) {
    const user: User = await this.userService.findOne(client.userId);
    log(user);
    if (user?.company != null) {
      client.join(user.company.id);
      client.data['company'] = user.company.id;
    }
  }
}
