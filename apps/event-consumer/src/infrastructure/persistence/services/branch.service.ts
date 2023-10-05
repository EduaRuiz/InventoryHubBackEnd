import { BranchPostgresService } from '../databases/postgres/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BranchService extends BranchPostgresService {}
