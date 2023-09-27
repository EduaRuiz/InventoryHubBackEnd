import { ProductPostgresService } from '../databases/postgres/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService extends ProductPostgresService {}
