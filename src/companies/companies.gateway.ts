import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@WebSocketGateway()
export class CompaniesGateway {
  constructor(private readonly companiesService: CompaniesService) {}

  @SubscribeMessage('createCompany')
  create(@MessageBody() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @SubscribeMessage('findAllCompanies')
  findAll() {
    return this.companiesService.findAll();
  }

  @SubscribeMessage('findOneCompany')
  findOne(@MessageBody() id: number) {
    return this.companiesService.findOne(id);
  }

  @SubscribeMessage('updateCompany')
  update(@MessageBody() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(updateCompanyDto.id, updateCompanyDto);
  }

  @SubscribeMessage('removeCompany')
  remove(@MessageBody() id: number) {
    return this.companiesService.remove(id);
  }
}
