import { BeforeInsert, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { nanoid } from 'nanoid';
import { Job } from "src/jobs/entities/job.entity";
import { AbstractEntity } from "src/postgres-db/abstract.entity";

@Entity()
export class Picture extends AbstractEntity<Picture> {

    @ManyToOne(() => (Job))
    @JoinColumn()
    Job: string;
   
}