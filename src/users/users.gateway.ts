import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, ConnectedSocket } from '@nestjs/websockets';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Namespace } from "socket.io";
import { Logger } from '@nestjs/common';
import { SocketWithAuth } from 'src/auth/auth-extensions';

@WebSocketGateway()
export class UsersGateway implements OnGatewayConnection,OnGatewayDisconnect,OnGatewayInit {
  constructor(private readonly usersService: UsersService) {}

  private readonly logger = new Logger(UsersGateway.name);

  
  @WebSocketServer()
  io: Namespace;


  afterInit(): void {
    this.logger.log("Users Gateway initialised.");
  }
 
  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    
    this.logger.log(`WebSocket Client with id: ${client.userId} connected.`);
    this.logger.log(`Amount of connected sockets: ${sockets.size}`)
  }

  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.logger.log(`WebSocket Client with id: ${client.userId} connected.`);
    this.logger.log(`Amount of connected sockets: ${sockets.size}`)
  }

  
  @SubscribeMessage('createUser')
  async create(@MessageBody() createUserDto: CreateUserDto,
          @ConnectedSocket() client: SocketWithAuth,) {
    createUserDto.id =  client.userId;
    createUserDto.email = client.email;
    return await this.usersService.create(createUserDto);
  }
 
  @SubscribeMessage('findOneUser')
  findOne(@ConnectedSocket() client: SocketWithAuth,) {
    return this.usersService.findOne(client.userId);
  }

  @SubscribeMessage('updateUser')
  update(@MessageBody() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @SubscribeMessage('removeUser')
  remove(@ConnectedSocket() client: SocketWithAuth,) {
    return this.usersService.remove(client.userId);
  }

}
