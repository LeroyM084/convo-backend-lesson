export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export interface MailTemplate {
  subject: string;
  text: string;
  html: string;
}

export interface WelcomeEmailData {
  username: string;
  email: string;
  userId: string;
}

export interface UnreadMessagesEmailData {
  email: string;
  username?: string;
  unreadCount: number;
  messages: Array<{
    content: string;
    senderName?: string;
    createdAt: Date;
  }>;
}

export interface MailerConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export enum EmailType {
  WELCOME = 'welcome',
  UNREAD_MESSAGES = 'unread_messages'
}
