import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserDomainModel } from '@domain-models';
import { BranchPostgresEntity } from './branch-postgres.entity';
import { SalePostgresEntity } from './sale-postgres.entity';

@Entity('user', { schema: 'public' })
export class UserPostgresEntity extends UserDomainModel {
  @Column('uuid', { primary: true, name: 'User_id' })
  id: string;

  @Column('varchar', { name: 'full_name' })
  fullName: string;

  @Column('varchar', { name: 'email', unique: true })
  email: string;

  @Column('varchar', { name: 'password' })
  password: string;

  @Column('varchar', { name: 'role' })
  role: string;

  @Column('uuid', { name: 'branch_id', nullable: true })
  branchId: string;

  @ManyToOne(() => BranchPostgresEntity, (branch) => branch.users)
  @JoinColumn({ name: 'branch_id' })
  branch: BranchPostgresEntity;

  @OneToMany(() => SalePostgresEntity, (saleProduct) => saleProduct.user)
  sale: SalePostgresEntity[];
}
