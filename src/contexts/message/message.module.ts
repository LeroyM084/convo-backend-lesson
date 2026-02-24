import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "./entities/message.entities";
import { MESSAGE_REPOSITORY } from "./message.repository.interface";
import { MessageRepository } from "./message.repository";
import { AuthGuard } from "../../core/guards/auth.guard";
import { JWT_SERVICE } from "../auth/interface/jwt.interface";
import { JWTService } from "../auth/jwt.service";
import { MessageNotificationCron } from "./message-notification.cron";
import { ConversationEntity } from "../conversation/entities/conversation.entities";
import { UserProfileEntity } from "../auth/entities/user_profile.entities";
import { UserCredentialsEntity } from "../auth/entities/user_credentials.entities";

@Module({
    imports: [TypeOrmModule.forFeature([
        MessageEntity,
        ConversationEntity,
        UserProfileEntity,
        UserCredentialsEntity,
    ])],
    controllers: [MessageController],
    providers: [
        MessageService,
        MessageNotificationCron,
        { provide: MESSAGE_REPOSITORY, useClass: MessageRepository },
        { provide: JWT_SERVICE, useClass: JWTService },
        AuthGuard
    ],
})
export class MessageModule {}