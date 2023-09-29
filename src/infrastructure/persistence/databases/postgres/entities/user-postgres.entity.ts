import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserDomainModel } from '@domain-models';
import { BranchPostgresEntity } from './branch-postgres.entity';

@Entity('user', { schema: 'public' })
export class UserPostgresEntity extends UserDomainModel {
  @Column('uuid', {
    primary: true,
    name: 'User_id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'email', unique: true })
  email: string;

  @Column('character varying', { name: 'password' })
  password: string;

  @Column('character varying', { name: 'role' })
  role: string;

  @Column('uuid', { name: 'branch_id' })
  branchId: string;

  @ManyToOne(() => BranchPostgresEntity, (branch) => branch.users)
  @JoinColumn({ name: 'branch_id' })
  branch: BranchPostgresEntity;
}
