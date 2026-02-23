import { Injectable, Inject } from '@nestjs/common';
import { CONVERSATION_REPOSITORY, IConversationRepository } from './conversation.repository.interface';
import { ConversationDTO, UpdateConversationDTO } from './types/conversation.dto';
import { ConversationEntity } from './entities/conversation.entities';

@Injectable()
export class ConversationService {
  constructor(
    @Inject(CONVERSATION_REPOSITORY) private readonly conversationRepository: IConversationRepository
  ) {}

  async createConversation(title: string): Promise<ConversationEntity> {
    return this.conversationRepository.createConversation(title);
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
}