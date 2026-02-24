import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserCredentialsEntity } from "./entities/user_credentials.entities";
import { AUTH_REPOSITORY } from "./auth.repository.interface";
import { AuthRepository } from "./auth.repository";
import { PASSWORD_HASHER } from "./interface/password-hasher.interface";
import { PasswordHasherService } from "./password-hasher.service";
import { JWT_SERVICE } from "./interface/jwt.interface";
import { JWTService } from "./jwt.service";
import { UserProfileEntity } from "./entities/user_profile.entities";
import { EventModule } from '../../core/event/event.module';
import { SendUserRegisteredHandler } from "./handlers/send-user-registered";
import { MailerModule } from '../../core/mailer/mailer.module';

@Module({
    imports: [TypeOrmModule.forFeature([
        UserCredentialsEntity, UserProfileEntity
    ]), EventModule, MailerModule],
    controllers: [AuthController],
    providers: [AuthService, SendUserRegisteredHandler,
        { provide: AUTH_REPOSITORY, useClass: AuthRepository },
        { provide: PASSWORD_HASHER, useClass: PasswordHasherService },
        { provide: JWT_SERVICE, useClass: JWTService }
    ],
    exports: [JWT_SERVICE]
})
export class AuthModule { }