/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { AbstractEntity } from 'src/postgres-db/abstract.entity';
import { Job } from './job.entity';


// It just contains a id of photo
@Entity()
export class Picture extends AbstractEntity<Picture> {

    @ManyToOne(() => Job,(job) => job.pictures,{cascade : ["insert","update"]})
    @JoinColumn()
    job: Job;
}
