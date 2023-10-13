import { UserPostgresService } from '../databases/postgres/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService extends UserPostgresService {}
