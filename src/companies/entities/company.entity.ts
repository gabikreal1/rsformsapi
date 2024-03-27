import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";
import { nanoid } from 'nanoid';

@Entity()
export class Company {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({nullable:true})
    address: string;

    @Column({nullable:true})
    city: string;

    @Column({nullable:true})
    postcode: string;

    @Column({nullable:true})
    phoneNumber: string;

    @Column({nullable:true})
    bankName: string;

    @Column({nullable:true})
    accountNumber: string;

    @Column({nullable:true})
    sortCode: string;

    @Column({default:0})
    invoiceCounter: number;

    @Column()
    ownerUserId: string;

    @Column()
    shareKey: string;
    
    @Column({type:'json',nullable:true})
    jobDetailsTemplate: JSON;


    constructor(company: Partial<Company>){
        Object.assign(this,company);
    }



    @BeforeInsert()
    private beforeInsert(){
        this.id = this.getId();
        this.shareKey = this.getShareKey();
    }

    

    getShareKey(): string{
        return this.shareKey || nanoid();
    }
    
    getId(): string{
        return this.id || nanoid();
    }


}
