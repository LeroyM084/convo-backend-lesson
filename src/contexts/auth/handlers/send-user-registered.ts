import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AUTH_USER_REGISTER_EVENT, UserRegisteredEvent } from '../event/user-registered.event';
import { MailerService } from '../../../core/mailer';

@Injectable()
export class SendUserRegisteredHandler {
    private readonly logger = new Logger(SendUserRegisteredHandler.name);

    constructor(private readonly mailerService: MailerService) {}

    @OnEvent(AUTH_USER_REGISTER_EVENT)
    async handle(event: any) {
        const payload = (event['payload'] || event) as {
            email: string;
            username: string;
            id: string;
        };

        if (payload.email) {
            this.logger.log(`Handling welcome email for user: ${payload.email}`);

            try {
                const result = await this.mailerService.sendWelcomeEmail({
                    email: payload.email,
                    username: payload.username,
                    userId: payload.id,
                });

                this.logger.log(`Welcome email sent: ${result.messageId}`);
                if (result.previewUrl) {
                    this.logger.log(`Preview URL: ${result.previewUrl}`);
                }
            } catch (error) {
                this.logger.error(`Error sending welcome email to ${payload.email}`, error);
            }
        }
    }
}
