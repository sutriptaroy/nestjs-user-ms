import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './v1/users/users.module';
import { AuthModule } from './v1/auth/auth.module';
import { UsersController } from './v1/users/users.controller';
import Config from './configs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [Config]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(config) => ({
        uri: config.get('db.mongo.connectionString')
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
