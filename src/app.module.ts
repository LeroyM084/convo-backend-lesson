import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './contexts/profile/profile.module';
import { AuthModule } from './contexts/auth/auth.module';
import { MessageModule } from './contexts/message/message.module';
import { ResourceModule } from './contexts/resource/resources.groupe.module';
import { ConversationModule } from './contexts/conversation/conversation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST') || 'localhost',
        port: config.get<number>('DB_PORT') || 3307,
        username: config.get<string>('DB_USERNAME') || 'user',
        password: config.get<string>('DB_PASSWORD') || 'password',
        database: config.get<string>('DB_NAME') || 'backend_db',
        driver: require('mysql2'),
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
        logging: config.get<string>('DB_LOGGING') === 'true',

        autoLoadEntities: true,
        charset: 'utf8mb4',
        timezone: 'Z',

        migrations: [
          join(process.cwd(), 'dist/core/database/migrations/*.js'),
          join(process.cwd(), 'src/core/database/migrations/*.ts'),
        ],
      }),
    }),
    ProfileModule,
    AuthModule,
    MessageModule,
    ResourceModule,
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}