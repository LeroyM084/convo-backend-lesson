import { MessageEntity } from "./entities/message.entities"

export const MESSAGE_REPOSITORY = Symbol('MESSAGE_REPOSITORY');

export interface IMessageRepository {
    findCredentialsByEmail(email: string): Promise<MessageEntity | null>;
    createMessage(
        content: string,
        senderId: string,
        conversationId: string
    ): Promise<MessageEntity>;
    getMessagesByConversationId(conversationId: string): Promise<MessageEntity[]>;
}