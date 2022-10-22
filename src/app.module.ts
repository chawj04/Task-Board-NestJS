import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    // MySQL_Connection
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nestjs',
      autoLoadEntities: true,
      // Dev -> true | Prod -> false
      synchronize: true,
      // Time - Seoul
      timezone: 'Z',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
