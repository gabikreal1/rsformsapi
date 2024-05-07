import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { AbstractEntity } from 'src/postgres-db/abstract.entity';
import { Service } from 'src/services/entities/service.entity';
import { Picture } from './picture.entity';

class longTransformer {
  public to(data: number): number {
      return data;
  }
  public from(data: string): number {
      return parseInt(data);
  }
}
@Entity()
export class Job extends AbstractEntity<Job> {
  @Column()
  client: string;

  @Column()
  agent: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  postcode: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  contactNumber: string;

  @Column({ nullable: false, type:"bigint" ,transformer : new longTransformer()})
  startTime: number;

  @Column({ nullable: false , type:"bigint",transformer : new longTransformer()})
  endTime: number;

  @Column({ default : false })
  isCompleted: boolean;

  @Column({ nullable: true ,type:"float",default:0.0 })
  price: number;

  @Column({ nullable: true })
  invoiceNumber: number;

  @Column({ nullable: true })
  YHS: string;

  @Column({ nullable: true })
  jobNo: string;


  @Column({ nullable: false,type:"bigint",transformer : new longTransformer()})
  lastUpdatedTime: number;

  @Column({ nullable: true })
  removed: boolean;

  @OneToMany(() => Picture,(picture) => picture.job,{cascade:true})
  pictures: Picture[];
  
  @ManyToOne(() => Company,{cascade:["insert","update"]})
  @JoinColumn()
  company: Company;

  @OneToMany(() => Service,(service) => service.job,{cascade:['insert','update','remove']})
  @JoinColumn()
  services: Service[];
}


