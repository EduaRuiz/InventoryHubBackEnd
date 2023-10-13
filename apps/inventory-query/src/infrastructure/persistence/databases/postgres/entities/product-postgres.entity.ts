import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ProductDomainModel } from '@domain-models';
import { BranchPostgresEntity } from './branch-postgres.entity';
import { ProductCategoryEnum } from '@enums';

@Entity('product', { schema: 'public' })
@Index(['name', 'branchId'], { unique: true })
export class ProductPostgresEntity extends ProductDomainModel {
  @Column('uuid', {
    primary: true,
    name: 'product_id',
  })
  id: string;

  @Column('varchar', { name: 'name', nullable: false })
  name: string;

  @Column('varchar', { name: 'description', nullable: false })
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

  @Column('varchar', { name: 'category', nullable: false })
  category: ProductCategoryEnum;

  @Column('uuid', { name: 'branch_id', nullable: false })
  branchId: string;

  @ManyToOne(() => BranchPostgresEntity, (branch) => branch.products, {
    nullable: false,
  })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchPostgresEntity;
}
