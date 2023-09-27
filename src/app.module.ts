import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserController } from './infrastructure/controllers/user.controller';
import { BranchController } from './infrastructure/controllers/branch.controller';
import { ProductController } from './infrastructure/controllers/product.controller';
import { PersistenceModule } from './infrastructure/persistence';
// import { ConfigModule } from '@nestjs/config';
// import { join } from 'path';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: join(
    //     process.cwd(),
    //     'environments',
    //     `.env.${process.env.SCOPE?.trimEnd()}`,
    //   ),
    // }),
    PersistenceModule,
    // MessagingModule,
    // HttpModule,
  ],
  controllers: [UserController, BranchController, ProductController],
  providers: [AppService],
})
export class AppModule {}
