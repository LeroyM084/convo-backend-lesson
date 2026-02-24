export const MESSAGE_SENT_EVENT = 'message.sent';

export class MessageSentEvent {
    static eventName = MESSAGE_SENT_EVENT;

    static create(payload: {
        id: string;
        content: string;
        senderId: string;
        conversationId: string;
        createdAt: Date;
    }) {
        return { eventName: MessageSentEvent.eventName, payload };
    }
}

