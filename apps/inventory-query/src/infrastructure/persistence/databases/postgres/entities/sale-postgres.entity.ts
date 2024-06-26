import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SaleDomainModel } from '@domain-models';
import { UserPostgresEntity } from './user-postgres.entity';
import { SaleProductPostgresEntity } from './sale-product.postgres.entity';
import { SaleTypeEnum } from '@enums';
import { BranchPostgresEntity } from '.';

@Entity('sale', { schema: 'public' })
export class SalePostgresEntity extends SaleDomainModel {
  @Column('uuid', {
    primary: true,
    name: 'sale_id',
  })
  id: string;

  @Column('int', {
    name: 'number_id',
    nullable: false,
    unique: false,
  })
  number: number;

  @Column('date', { name: 'date', nullable: false })
  date: Date;

  @Column('varchar', { name: 'type', nullable: false })
  type: SaleTypeEnum;

  @Column('decimal', {
    name: 'total',
    nullable: false,
    precision: 10,
    scale: 2,
  })
  total: number;

  @Column('uuid', { name: 'user_id', nullable: false })
  userId: string;

  @Column('uuid', { name: 'branch_id', nullable: false })
  branchId: string;

  @OneToMany(
    () => SaleProductPostgresEntity,
    (saleProduct) => saleProduct.sale,
    { cascade: true },
  )
  products: SaleProductPostgresEntity[];

  @ManyToOne(() => UserPostgresEntity, (user) => user.sale)
  @JoinColumn({ name: 'user_id' })
  user: UserPostgresEntity[];

  @ManyToOne(() => BranchPostgresEntity, (branch) => branch.sales)
  @JoinColumn({ name: 'branch_id' })
  branch: BranchPostgresEntity[];
}
