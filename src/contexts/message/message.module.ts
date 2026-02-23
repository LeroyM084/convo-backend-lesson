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

@Module({
    imports: [TypeOrmModule.forFeature([
        MessageEntity
    ])],
    controllers: [MessageController],
    providers: [
        MessageService, 
        {provide: MESSAGE_REPOSITORY, useClass: MessageRepository},
        {provide: JWT_SERVICE, useClass: JWTService},
        AuthGuard
    ],
})
export class MessageModule {}