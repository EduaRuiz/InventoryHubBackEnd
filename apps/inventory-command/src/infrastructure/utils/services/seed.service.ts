import { SeedUserDomainModel, UserRoleEnum } from '@domain';
import { ISeedService } from '@domain-services';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SeedUserUseCase } from '@use-cases-command/user';
import { Observable } from 'rxjs';

@Injectable()
export class SeedService implements ISeedService, OnModuleInit {
  constructor(
    private readonly seedUserUseCase: SeedUserUseCase,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.seedData().subscribe();
  }

  seedData(): Observable<SeedUserDomainModel> {
    const seedUserMail =
      this.configService.get<string>('SEED_USER_MAIL') ||
      'superadmin@superadmin.com';
    const seedUserPassword =
      this.configService.get<string>('SEED_USER_PASSWORD') || 'superadmin';
    const seedUserFullName = {
      firstName:
        this.configService.get<string>('SEED_USER_FIRST_NAME') || 'SuperAdmin',
      lastName:
        this.configService.get<string>('SEED_USER_LAST_NAME') || 'SuperAdmin',
    };
    const userSeed = {
      email: seedUserMail,
      password: seedUserPassword,
      fullName: seedUserFullName,
      role: UserRoleEnum.SUPER_ADMIN,
    };
    return this.seedUserUseCase.execute(userSeed);
  }
}
