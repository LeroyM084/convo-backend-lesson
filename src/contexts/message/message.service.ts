import { Injectable, Inject } from '@nestjs/common';
import { MESSAGE_REPOSITORY, IMessageRepository } from './message.repository.interface';
import { MessageDTO } from './types/message.dto';
import { MessageEntity } from './entities/message.entities';
import { EVENT_BUS, EventBusPort } from '../../core/event/event-bus.port';
import { MessageSentEvent } from './event/message-sent.event';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGE_REPOSITORY) private readonly messageRepository: IMessageRepository,
    @Inject(EVENT_BUS) private readonly eventBus: EventBusPort,
  ) {}

  async sendMessage(
    content: string,
    senderId: string,
    conversationId: string
  ): Promise<MessageEntity> {
    const message = await this.messageRepository.createMessage(
      content,
      senderId,
      conversationId
    );

    await this.eventBus.publish(
      MessageSentEvent.create({
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        conversationId: message.conversationId,
        createdAt: message.createdAt,
      }),
    );

    return message;
  }

  async getConversationMessages(conversationId: string): Promise<MessageEntity[]> {
    return await this.messageRepository.getMessagesByConversationId(conversationId);
  }

  async markConversationMessagesAsReadForUser(
    conversationId: string,
    userId: string
  ): Promise<MessageEntity[]> {
    await this.messageRepository.markMessagesAsReadForUser(conversationId, userId);
    return this.messageRepository.getMessagesByConversationId(conversationId);
  }
}

