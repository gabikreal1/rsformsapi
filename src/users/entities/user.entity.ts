import { Column, Entity, ManyToOne } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { AbstractEntity } from 'src/postgres-db/abstract.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  fcmToken: string;

  @ManyToOne(() => Company, (company) => company.users, {
    cascade: ['insert', 'update'],
  })
  company?: Company;
}
