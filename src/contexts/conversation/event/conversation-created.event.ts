export const CONVERSATION_CREATED_EVENT = 'conversation.created';

export class ConversationCreatedEvent {
    static eventName = CONVERSATION_CREATED_EVENT;

    static create(payload: {
        id: string;
        name: string | null;
        createdAt: Date;
    }) {
        return { eventName: ConversationCreatedEvent.eventName, payload };
    }
}

