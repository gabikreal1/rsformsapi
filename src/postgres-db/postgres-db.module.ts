import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      
      useFactory: (configService: ConfigService) => ({
        
        type: 'postgres',
        host: configService.getOrThrow('POSTGRESQL_HOST'),
        port: configService.getOrThrow('POSTGRESQL_PORT'),
        database: configService.getOrThrow('POSTGRESQL_DATABASE'),
        username: configService.getOrThrow('POSTGRESQL_USERNAME'),
        password: configService.getOrThrow('POSTGRESQL_PASSWORD'),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('POSTGRESQL_SYNCHRONIZE'),
        bigNumberStrings: false,
      }),
      
      inject: [ConfigService],
    }),
  ],
})
export class PostgresDbModule {}