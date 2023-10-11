import { SalePostgresService } from '../databases/postgres/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaleService extends SalePostgresService {}
