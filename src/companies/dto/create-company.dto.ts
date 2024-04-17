export class CreateCompanyDto {
    
    name: string;

    address?: string;

    city?: string;

    postcode?: string;

    phoneNumber?: string;

    bankName?: string;

    accountNumber?: string;

    sortCode?: string;

    invoiceCounter?: number;

    ownerUserId: string;


}
