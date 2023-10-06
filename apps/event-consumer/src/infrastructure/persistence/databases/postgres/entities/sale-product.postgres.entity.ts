import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SaleProductDomainModel } from '@domain-models';
import { SalePostgresEntity } from './sale-postgres.entity';

@Entity('sale_product', { schema: 'public' })
export class SaleProductPostgresEntity extends SaleProductDomainModel {
  @Column('uuid', {
    primary: true,
    name: 'sale_product_id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'name', nullable: false })
  name: string;

  @Column('decimal', {
    name: 'price',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column('int', { name: 'quantity', nullable: false })
  quantity: number;

  @Column('uuid', { name: 'sale_id' })
  saleId: string;

  @ManyToOne(() => SalePostgresEntity, (sale) => sale.products, {
    nullable: false,
  })
  @JoinColumn({ name: 'sale_id' })
  sale: SalePostgresEntity;
}
