import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import { nanoid } from 'nanoid';
import { AbstractEntity } from "src/postgres-db/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Job } from "src/jobs/entities/job.entity";

@Entity()
export class Company extends AbstractEntity<Company> {

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

    @OneToMany(()=>User,(user)=>user.company,{cascade:["insert","update"],eager:true})
    @JoinColumn()
    users: User[];

    @OneToMany(()=>Job,(job)=>job.company,{cascade:["insert","update"]})
    @JoinColumn()
    jobs: Job[];
    
    constructor(entity: Partial<Company>){

        super(entity);
        this.shareKey = this.shareKey ?? nanoid();

    }
    




}
