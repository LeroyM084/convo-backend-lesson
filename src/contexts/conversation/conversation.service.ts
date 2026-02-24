import { Injectable, Inject } from '@nestjs/common';
import { CONVERSATION_REPOSITORY, IConversationRepository } from './conversation.repository.interface';
import { ConversationDTO, UpdateConversationDTO } from './types/conversation.dto';
import { ConversationEntity } from './entities/conversation.entities';
import { EVENT_BUS, EventBusPort } from '../../core/event/event-bus.port';
import { ConversationCreatedEvent } from './event/conversation-created.event';

@Injectable()
export class ConversationService {
  constructor(
    @Inject(CONVERSATION_REPOSITORY) private readonly conversationRepository: IConversationRepository,
    @Inject(EVENT_BUS) private readonly eventBus: EventBusPort,
  ) {}

  async createConversation(title: string): Promise<ConversationEntity> {
    const conversation = await this.conversationRepository.createConversation(title);

    await this.eventBus.publish(
      ConversationCreatedEvent.create({
        id: conversation.id,
        name: conversation.name,
        createdAt: conversation.createdAt,
      }),
    );

    return conversation;
  }

  async findConversationById(id: string): Promise<any> {
    return this.conversationRepository.findConversationById(id);
  }

  async updateConversation(body: UpdateConversationDTO): Promise<any> {

    const entity = await this.conversationRepository.findConversationById(body.id)
    if(entity === null) return;
    entity.name = body.title
    return this.conversationRepository.updateConversation(entity);
  }

  async deleteConversation(entity: any): Promise<void> {
    await this.conversationRepository.deleteConversation(entity);
  }

  async getUserConversationsWithUnreadCount(userId: string): Promise<any> {
    return this.conversationRepository.findUserConversationsWithUnreadCount(userId);
  }
}