
import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { nanoid } from 'nanoid';
import { Company } from "src/companies/entities/company.entity";
import { AbstractEntity } from "src/postgres-db/abstract.entity";

@Entity()

export class User extends AbstractEntity<User> {
    
    @Column({unique:true})
    email: string;

    @Column({nullable: true})
    fcmToken: string;

    @ManyToOne(() => Company,(company) => company.users,{cascade:["insert","update"]})
    company? : Company;

}
