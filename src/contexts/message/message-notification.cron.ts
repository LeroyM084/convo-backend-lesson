import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { MessageEntity } from "./entities/message.entities";
import { ConversationEntity } from "../conversation/entities/conversation.entities";
import { UserProfileEntity } from "../auth/entities/user_profile.entities";
import { UserCredentialsEntity } from "../auth/entities/user_credentials.entities";
import * as nodemailer from "nodemailer";

@Injectable()
export class MessageNotificationCron {
    private readonly logger = new Logger(MessageNotificationCron.name);

    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
        @InjectRepository(ConversationEntity)
        private readonly conversationRepository: Repository<ConversationEntity>,
        @InjectRepository(UserProfileEntity)
        private readonly userProfileRepository: Repository<UserProfileEntity>,
        @InjectRepository(UserCredentialsEntity)
        private readonly userCredentialsRepository: Repository<UserCredentialsEntity>,
    ) { }

    @Cron("0,30 * * * *")
    async handleUnreadMessagesNotification() {
        const now = new Date();
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

        // 1. Récupérer tous les messages non lus pour lesquels isMailSent est faux
        const unreadMessages = await this.messageRepository.find({
            where: {
                isRead: false,
                isMailSent: false,
            },
        });

        if (unreadMessages.length === 0) {
            return;
        }

        // 2. Charger les conversations associées
        const conversationIds = Array.from(new Set(unreadMessages.map((m) => m.conversationId)));
        const conversations = await this.conversationRepository.find({
            where: { id: In(conversationIds) },
            relations: ["participants"],
        });
        const conversationMap = new Map<string, ConversationEntity>();
        for (const conv of conversations) {
            conversationMap.set(conv.id, conv);
        }

        // 3. Charger tous les profils & credentials des participants
        const profileIds = new Set<string>();
        const credentialsIds = new Set<string>();

        for (const conv of conversations) {
            for (const participant of conv.participants as unknown as UserProfileEntity[]) {
                profileIds.add(participant.id);
            }
        }

        if (profileIds.size === 0) {
            return;
        }

        const profiles = await this.userProfileRepository.find({
            where: { id: In(Array.from(profileIds)) },
        });

        for (const profile of profiles) {
            if (profile.userCredentialsId) {
                credentialsIds.add(profile.userCredentialsId);
            }
        }

        const credentialsList = await this.userCredentialsRepository.find({
            where: { id: In(Array.from(credentialsIds)) },
        });

        const credentialsMap = new Map<string, UserCredentialsEntity>();
        for (const cred of credentialsList) {
            credentialsMap.set(cred.id, cred);
        }

        // 4. Regrouper les messages par destinataire qui est déconnecté depuis > 30 minutes
        const recipientMessagesMap = new Map<string, MessageEntity[]>();

        for (const message of unreadMessages) {
            const conversation = conversationMap.get(message.conversationId);
            if (!conversation) {
                continue;
            }

            for (const participant of conversation.participants as unknown as UserProfileEntity[]) {
                const credentials = credentialsMap.get(participant.userCredentialsId);
                if (!credentials) {
                    continue;
                }

                // Ne pas notifier l'expéditeur lui-même
                if (credentials.id === message.senderId) {
                    continue;
                }

                const lastConnectionAt = credentials.lastConnectionAt;
                if (lastConnectionAt && lastConnectionAt > thirtyMinutesAgo) {
                    // L'utilisateur s'est connecté récemment (< 30 minutes)
                    continue;
                }

                const list = recipientMessagesMap.get(credentials.id) || [];
                list.push(message);
                recipientMessagesMap.set(credentials.id, list);
            }
        }

        if (recipientMessagesMap.size === 0) {
            return;
        }

        // 5. Configuration Nodemailer avec un compte de test Ethereal
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        const messagesToMarkAsSent = new Set<string>();

        // 6. Envoyer un email par destinataire
        for (const [credentialsId, messages] of recipientMessagesMap.entries()) {
            const credentials = credentialsMap.get(credentialsId);
            if (!credentials || !credentials.email) {
                continue;
            }

            const unreadCount = messages.length;

            try {
                const info = await transporter.sendMail({
                    from: '"Conversation App" <noreply@conversationapp.com>',
                    to: credentials.email,
                    subject: "Vous avez de nouveaux messages non lus",
                    text: `Vous avez ${unreadCount} message(s) non lu(s) dans vos conversations.`,
                    html: `<p>Bonjour,</p><p>Vous avez <b>${unreadCount}</b> message(s) non lu(s) dans vos conversations.</p>`,
                });

                this.logger.log(`Notification email sent to ${credentials.email}: ${info.messageId}`);
                this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

                for (const msg of messages) {
                    messagesToMarkAsSent.add(msg.id);
                }
            } catch (error) {
                this.logger.error(`Error sending unread messages email to ${credentials.email}`, error);
            }
        }

        // 7. Marquer les messages comme "Mail envoyé" pour éviter les doublons
        if (messagesToMarkAsSent.size > 0) {
            await this.messageRepository.update(
                { id: In(Array.from(messagesToMarkAsSent)) },
                { isMailSent: true },
            );
        }
    }
}

