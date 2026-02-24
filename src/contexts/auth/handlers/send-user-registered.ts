import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AUTH_USER_REGISTER_EVENT, UserRegisteredEvent } from '../event/user-registered.event';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SendUserRegisteredHandler {
    private readonly logger = new Logger(SendUserRegisteredHandler.name);

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
                // Create a test account (Ethereal) for Nodemailer
                const testAccount = await nodemailer.createTestAccount();

                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: testAccount.user, // generated ethereal user
                        pass: testAccount.pass, // generated ethereal password
                    },
                });

                const info = await transporter.sendMail({
                    from: '"Notes App" <noreply@notesapp.com>',
                    to: payload.email,
                    subject: 'Welcome to Notes App!',
                    text: `Hello ${payload.username}, welcome to Notes App!`,
                    html: `<b>Hello ${payload.username}, welcome to Notes App!</b>`,
                });

                this.logger.log(`Message sent: ${info.messageId}`);
                this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            } catch (error) {
                this.logger.error(`Error sending email to ${payload.email}`, error);
            }
        }
    }
}
