import { BeforeInsert, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { nanoid } from 'nanoid';
import { Company } from "src/companies/entities/company.entity";

@Entity()
export class Job {

    @PrimaryColumn()
    id : string;

    @Column()
    client: string;

    @Column({nullable: true})
    address: string;

    @Column({nullable: true})
    postcode: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable:true})
    contactNumber: string;

    @Column({nullable:false})
    startTime: BigInt;

    @Column({nullable:false})
    endTime: BigInt;

    @Column({nullable:false})
    isCompleted: Boolean;

    @Column({nullable:true})
    price: number;

    @Column({nullable:true})
    pictures: JSON;

    @Column({nullable:true})
    additionalJobDetails: JSON;

    @Column({nullable:false})
    lastUpdatedTime: BigInt;

    @Column({nullable:true})
    removed: Boolean;

    @ManyToOne(() => (Company))
    @JoinColumn()
    company: Company;

    constructor(company: Partial<Job>){
        Object.assign(this,company);
    }

    @BeforeInsert()
    private beforeInsert(){
        this.id = this.getId();
    }

    getId(): string{
        return this.id || nanoid();
    }
}
