import { Column, Entity, OneToMany } from 'typeorm';
import { ProductPostgresEntity, SalePostgresEntity } from '.';
import { BranchDomainModel } from '@domain-models';
import { UserPostgresEntity } from './user-postgres.entity';

@Entity('branch', { schema: 'public' })
export class BranchPostgresEntity extends BranchDomainModel {
  @Column('uuid', {
    primary: true,
    name: 'branch_id',
  })
  id: string;

  @Column('varchar', {
    name: 'name',
    length: 36,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column('varchar', {
    name: 'location',
    length: 50,
    nullable: false,
  })
  location: string;

  @OneToMany(() => ProductPostgresEntity, (product) => product.branch)
  products: ProductPostgresEntity[];

  @OneToMany(() => UserPostgresEntity, (user) => user.branch)
  users: UserPostgresEntity[];

  @OneToMany(() => SalePostgresEntity, (sale) => sale.branch)
  sales: SalePostgresEntity[];
}
