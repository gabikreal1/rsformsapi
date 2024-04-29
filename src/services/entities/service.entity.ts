import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from 'src/postgres-db/abstract.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Entity()
export class Service extends AbstractEntity<Service> {
  @Column()
  type: string;

  @Column()
  description: string;

  @Column({ scale: 2, default: 0.0 })
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Job, {cascade :["insert","update"]})
  @JoinColumn()
  job: Job;
}
