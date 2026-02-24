import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CONVERSATION_CREATED_EVENT } from '../event/conversation-created.event';

@Injectable()
export class LogConversationCreatedHandler {
    private readonly logger = new Logger(LogConversationCreatedHandler.name);

    @OnEvent(CONVERSATION_CREATED_EVENT)
    async handle(event: any) {
        const payload = (event['payload'] || event) as {
            id: string;
            name: string | null;
            createdAt: Date;
        };

        this.logger.log(`Conversation created: id=${payload.id}, name=${payload.name}`);
    }
}

