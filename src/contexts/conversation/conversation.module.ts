import { Module } from "@nestjs/common";
import { ConversationController } from "./conversation.controller";
import { ConversationService } from "./conversation.service";
import { ConversationEntity } from "./entities/conversation.entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CONVERSATION_REPOSITORY } from "./conversation.repository.interface";
import { ConversationRepository } from "./conversation.repository";
import { AuthModule } from "../auth/auth.module";
import { AuthGuard } from "../../core/guards/auth.guard";
import { PermissionsGuard } from "../../core/permissions/guards/permissions.guard";
import { EventModule } from "../../core/event/event.module";
import { MessageEntity } from "../message/entities/message.entities";
import { UserProfileEntity } from "../auth/entities/user_profile.entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ConversationEntity,
            MessageEntity,
            UserProfileEntity,
        ]),
        AuthModule,
        EventModule,
    ],
    controllers: [ConversationController],
    providers: [
        ConversationService,
        { provide: CONVERSATION_REPOSITORY, useClass: ConversationRepository },
        AuthGuard,
        PermissionsGuard,
    ],
})
export class ConversationModule {}