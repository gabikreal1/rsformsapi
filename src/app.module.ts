import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpAuthGuard } from './auth/http-auth.middleware';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';
import { ServicesModule } from './services/services.module';
import { ConfigModule } from '@nestjs/config';
import { FirebaseProvider } from './auth/firebase.provider';
import { PostgresDbModule } from './postgres-db/postgres-db.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    CompaniesModule,
    JobsModule,
    ServicesModule,
    PostgresDbModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpAuthGuard).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
