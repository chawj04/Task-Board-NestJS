import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import * as config from 'config';

const nestDbConfig = config.get('db');

@Module({
  imports: [
    UsersModule,
    // MySQL_Connection_Config_Setting
    TypeOrmModule.forRoot({
      type: nestDbConfig.type,
      host: nestDbConfig.host || process.env.DB_HOSTNAME,
      port: nestDbConfig.port || process.env.DB_PORT,
      username: nestDbConfig.username || process.env.DB_USERNAME,
      password: nestDbConfig.password || process.env.DB_PASSWORD,
      database: nestDbConfig.database || process.env.DB_DATABASE,
      autoLoadEntities: nestDbConfig.autoLoadEntities,
      // Dev -> true | Prod -> false
      synchronize: nestDbConfig.synchronize === 'production' ? false : true,
      // Time - Seoul
      timezone: 'Z',
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
