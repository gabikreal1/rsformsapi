import { Module, NestModule,MiddlewareConsumer,RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PreauthMiddleware } from './auth/preauth.middleware';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [ UsersModule, CompaniesModule, JobsModule, ServicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    // consumer.apply(PreauthMiddleware).forRoutes({
    //   path:'*',method: RequestMethod.ALL,
    // });
  }
}
