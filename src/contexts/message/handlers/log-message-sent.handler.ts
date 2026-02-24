import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MESSAGE_SENT_EVENT } from '../event/message-sent.event';

@Injectable()
export class LogMessageSentHandler {
    private readonly logger = new Logger(LogMessageSentHandler.name);

    @OnEvent(MESSAGE_SENT_EVENT)
    async handle(event: any) {
        const payload = (event['payload'] || event) as {
            id: string;
            content: string;
            senderId: string;
            conversationId: string;
            createdAt: Date;
        };

        this.logger.log(
            `Message sent: id=${payload.id}, conversation=${payload.conversationId}, sender=${payload.senderId}`,
        );
    }
}

