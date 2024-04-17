import { Company } from "src/companies/entities/company.entity";

export class CreateUserDto {
    id? : string;

    email?: string;

    fcmToken? :string;

    company? : Company;
}
