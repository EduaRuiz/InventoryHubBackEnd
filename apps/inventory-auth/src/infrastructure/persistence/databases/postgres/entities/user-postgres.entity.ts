import { BeforeInsert, Column, Entity } from 'typeorm';
import { UserDomainModel } from '@domain-models';
@Entity('user', { schema: 'public' })
export class UserPostgresEntity extends UserDomainModel {
  @Column('uuid', { primary: true, name: 'user_id', unique: true })
  id: string;

  @Column('varchar', { name: 'name' })
  name: string;

  @Column('varchar', { name: 'email', unique: true })
  email: string;

  @Column('varchar', { name: 'password' })
  password: string;

  @Column('varchar', { name: 'role' })
  role: string;

  @Column('uuid', { name: 'branch_i d', nullable: true })
  branchId: string;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
}
