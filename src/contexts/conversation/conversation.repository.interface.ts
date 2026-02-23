import { ConversationEntity } from "./entities/conversation.entities"

export const CONVERSATION_REPOSITORY = Symbol('CONVERSATION_REPOSITORY');

export interface IConversationRepository {
    createConversation(title: string): Promise<ConversationEntity>;
    findConversationById(id: string): Promise<ConversationEntity | null>;
    updateConversation(entity: ConversationEntity): Promise<ConversationEntity>;
    deleteConversation(entity: ConversationEntity): Promise<void>;
}