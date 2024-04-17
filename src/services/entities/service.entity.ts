
import { BeforeInsert, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { nanoid } from 'nanoid';
import { AbstractEntity } from "src/postgres-db/abstract.entity";

@Entity()
export class Service extends AbstractEntity<Service> {

    @Column()
    type:string;
}
