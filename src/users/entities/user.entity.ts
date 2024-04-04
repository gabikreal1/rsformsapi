
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { nanoid } from 'nanoid';
import { Company } from "src/companies/entities/company.entity";

@Entity()

export class User {

    @PrimaryColumn()
    id: string;

    @Column()
    email: string;3


    @Column({nullable: true})
    fcmToken: string;

    @ManyToOne(() => Company)
    @JoinColumn()
    company : Company;

    constructor(company: Partial<User>){
        Object.assign(this,User);
    }

    @BeforeInsert()
    private beforeInsert(){
        this.id = this.getId();
    }
    
    getId(): string{
        return this.id || nanoid();
    }
 

}
