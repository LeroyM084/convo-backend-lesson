import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailOptions, MailerConfig, EmailType, WelcomeEmailData, UnreadMessagesEmailData } from './mailer.types';
import { MailerTemplates } from './mailer.templates';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;
  private config: MailerConfig;

  constructor(private readonly configService: ConfigService) {
    // Initialize transporter asynchronously
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    // Always create a new Ethereal test account dynamically
    const testAccount = await nodemailer.createTestAccount();
    
    this.config = {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      from: 'Conversation App <noreply@conversationapp.com>',
    };
    
    this.logger.log('Using dynamically created Ethereal test account for email sending');
    this.logger.log(`Ethereal email: ${testAccount.user}`);

    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: this.config.auth,
    });
  }

  async sendMail(options: MailOptions): Promise<{ messageId: string; previewUrl?: string }> {
    // Ensure transporter is initialized
    if (!this.transporter) {
      await this.initializeTransporter();
    }

    try {
      const mailOptions = {
        from: options.from || this.config.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      this.logger.log(`Email sent successfully to ${options.to}: ${info.messageId}`);
      
      // Provide preview URL for Ethereal
      const previewUrl = info.messageId ? nodemailer.getTestMessageUrl(info) : undefined;
      
      if (previewUrl) {
        this.logger.log(`Preview URL: ${previewUrl}`);
      }

      return { messageId: info.messageId, previewUrl: previewUrl || undefined };
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<{ messageId: string; previewUrl?: string }> {
    const template = MailerTemplates.welcomeEmail(data);
    
    return this.sendMail({
      to: data.email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  async sendUnreadMessagesNotification(data: UnreadMessagesEmailData): Promise<{ messageId: string; previewUrl?: string }> {
    const template = MailerTemplates.unreadMessagesNotification(data);
    
    return this.sendMail({
      to: data.email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  async sendTemplateEmail(
    email: string, 
    type: EmailType, 
    data: WelcomeEmailData | UnreadMessagesEmailData
  ): Promise<{ messageId: string; previewUrl?: string }> {
    switch (type) {
      case EmailType.WELCOME:
        return this.sendWelcomeEmail(data as WelcomeEmailData);
      case EmailType.UNREAD_MESSAGES:
        return this.sendUnreadMessagesNotification(data as UnreadMessagesEmailData);
      default:
        throw new Error(`Unsupported email type: ${type}`);
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      // Ensure transporter is initialized
      if (!this.transporter) {
        await this.initializeTransporter();
      }
      
      await this.transporter.verify();
      this.logger.log('Mailer connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('Mailer connection verification failed', error);
      return false;
    }
  }
}
