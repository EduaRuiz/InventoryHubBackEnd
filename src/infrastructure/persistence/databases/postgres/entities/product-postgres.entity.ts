import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ProductDomainModel } from '@domain-models';
import { BranchPostgresEntity } from './branch-postgres.entity';

@Entity('product', { schema: 'public' })
@Index(['name', 'branchId'], { unique: true })
export class ProductPostgresEntity extends ProductDomainModel {
  @Column('uuid', {
    primary: true,
    name: 'product_id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'name', nullable: false })
  name: string;

  @Column('character varying', { name: 'description', nullable: false })
  description: string;

  @Column('decimal', {
    name: 'price',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column('int', { name: 'quantity', default: 0 })
  quantity: number;

  @Column('character varying', { name: 'category', nullable: false })
  category: string;

  @Column('uuid', { name: 'branch_id', nullable: false })
  branchId: string;

  @ManyToOne(() => BranchPostgresEntity, (branch) => branch.products, {
    nullable: false,
  })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchPostgresEntity;
}
