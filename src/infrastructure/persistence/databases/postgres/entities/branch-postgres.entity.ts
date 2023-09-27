import { Column, Entity, OneToMany } from 'typeorm';
import { ProductPostgresEntity } from '.';
import { BranchDomainModel } from '@domain-models';
import { UserPostgresEntity } from './user-postgres.entity';

@Entity('branch', { schema: 'public' })
export class BranchPostgresEntity extends BranchDomainModel {
  @Column('uuid', {
    primary: true,
    name: 'branch_id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', {
    name: 'name',
    length: 36,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column('character varying', {
    name: 'location',
    length: 50,
    nullable: false,
  })
  location: string;

  @OneToMany(() => ProductPostgresEntity, (product) => product.branch)
  products: ProductPostgresEntity[];

  @OneToMany(() => UserPostgresEntity, (user) => user.branch)
  users: UserPostgresEntity[];
}
