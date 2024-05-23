import { Injectable } from '@nestjs/common';
import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '2h' },
    };
  }
}
