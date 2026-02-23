import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageEntity } from "./entities/message.entities";
import { Repository } from "typeorm";

@Injectable()
export class MessageRepository {
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
    ) { }

    async createMessage(
        content: string,
        senderId: string,
        conversationId: string
    ): Promise<MessageEntity> {
        const message = this.messageRepository.create({
            content,
            senderId,
            conversationId,
        });

        return await this.messageRepository.save(message);
    }

    async getMessagesByConversationId(conversationId: string): Promise<MessageEntity[]> {
        return await this.messageRepository.find({
            where: { conversationId },
            relations: ['sender'],
            order: { createdAt: 'ASC' }
        });
    }
}