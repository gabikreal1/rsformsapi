import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Socket,Namespace } from "socket.io";


@WebSocketGateway({
  namespace:'companies',
})
export class CompaniesGateway {
  constructor(private readonly companiesService: CompaniesService) {}

  @SubscribeMessage('createCompany')
  async create(@MessageBody() createCompanyDto: CreateCompanyDto )  {
    return await this.companiesService.create(createCompanyDto);
  }

  @SubscribeMessage('findOneCompany')
  async findOne(@MessageBody() id: string) {
    return this.companiesService.findOne(id);
  }

  @SubscribeMessage('updateCompany')
  async update(@MessageBody() updateCompanyDto: UpdateCompanyDto) {
    return await this.companiesService.update(updateCompanyDto.id, updateCompanyDto);
  }

  @SubscribeMessage('removeCompany')
  async remove(@MessageBody() id: string) {
    return await this.companiesService.remove(id);
  }
}
