import {  Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Company } from "src/companies/entities/company.entity";
import { AbstractEntity } from "src/postgres-db/abstract.entity";

@Entity()
export class Job extends AbstractEntity<Job> {

    @Column()
    client: string;

    @Column()
    agent : string;

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
    lastUpdatedTime: number;

    @Column({nullable:true})
    removed: Boolean;

    @ManyToOne(() => (Company))
    @JoinColumn()
    company: Company;



}
