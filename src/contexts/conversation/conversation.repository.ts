import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConversationEntity } from "./entities/conversation.entities";
import { In, Repository } from "typeorm";
import { MessageEntity } from "../message/entities/message.entities";
import { UserProfileEntity } from "../auth/entities/user_profile.entities";

@Injectable()
export class ConversationRepository {
    constructor(
        @InjectRepository(ConversationEntity)
        private readonly conversationRepository: Repository<ConversationEntity>,
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
        @InjectRepository(UserProfileEntity)
        private readonly profileRepository: Repository<UserProfileEntity>,
    ) { }

    async createConversation(title: string): Promise<ConversationEntity> {
        const entity = new ConversationEntity();
        entity.name = title
        return this.conversationRepository.save(entity);
    }

    async findConversationById(id: string): Promise<ConversationEntity | null> {
        const entity = await this.conversationRepository.findOne({ where: { id } });
        return entity;
    }

    async updateConversation(entity: ConversationEntity): Promise<ConversationEntity> {
        return this.conversationRepository.save(entity);
    }

    async deleteConversation(entity: ConversationEntity): Promise<void> {
        await this.conversationRepository.remove(entity);
    }

    async findUserConversationsWithUnreadCount(userId: string): Promise<any> {
        const profile = await this.profileRepository.findOne({
            where: { userCredentialsId: userId },
        });

        if (!profile) {
            return [];
        }

        const conversations = await this.conversationRepository
            .createQueryBuilder('conversation')
            .innerJoin('conversation.participants', 'participant')
            .where('participant.id = :profileId', { profileId: profile.id })
            .orderBy('conversation.created_at', 'DESC')
            .getMany();

        if (conversations.length === 0) {
            return [];
        }

        const conversationIds = conversations.map((c) => c.id);

        const unreadRows = await this.messageRepository
            .createQueryBuilder('message')
            .select('message.conversationId', 'conversationId')
            .addSelect('COUNT(message.id)', 'unreadCount')
            .where('message.conversationId IN (:...conversationIds)', { conversationIds })
            .andWhere('message.isRead = false')
            .groupBy('message.conversationId')
            .getRawMany<{ conversationId: string; unreadCount: string }>();

        const unreadMap = new Map<string, number>();
        for (const row of unreadRows) {
            unreadMap.set(row.conversationId, Number(row.unreadCount));
        }

        return conversations.map((conversation) => ({
            conversation,
            unreadCount: unreadMap.get(conversation.id) ?? 0,
        }));
    }
}