import { Injectable, Inject } from '@nestjs/common';
import { MESSAGE_REPOSITORY, IMessageRepository } from './message.repository.interface';
import { MessageDTO } from './types/message.dto';
import { MessageEntity } from './entities/message.entities';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGE_REPOSITORY) private readonly messageRepository: IMessageRepository
  ) {}

  async sendMessage(
    content: string,
    senderId: string,
    conversationId: string
  ): Promise<MessageEntity> {
    return await this.messageRepository.createMessage(
      content,
      senderId,
      conversationId
    );
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

