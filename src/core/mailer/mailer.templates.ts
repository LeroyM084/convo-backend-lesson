import { MailTemplate, WelcomeEmailData, UnreadMessagesEmailData } from './mailer.types';

export class MailerTemplates {
  static welcomeEmail(data: WelcomeEmailData): MailTemplate {
    return {
      subject: 'Welcome to Notes App!',
      text: `Hello ${data.username}, welcome to Notes App! Your account has been successfully created.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Notes App! 🎉</h2>
          <p>Hello <strong>${data.username}</strong>,</p>
          <p>Welcome to Notes App! Your account has been successfully created.</p>
          <p>You can now start using our platform to manage your notes and collaborate with others.</p>
          <br>
          <p>Best regards,<br>The Notes App Team</p>
        </div>
      `
    };
  }

  static unreadMessagesNotification(data: UnreadMessagesEmailData): MailTemplate {
    const messageList = data.messages.map(msg => 
      `<div style="border-left: 3px solid #007bff; padding-left: 10px; margin-bottom: 15px;">
        <p style="margin: 0; color: #666; font-size: 12px;">${msg.senderName || 'Unknown'} • ${new Date(msg.createdAt).toLocaleString()}</p>
        <p style="margin: 5px 0;">${msg.content}</p>
      </div>`
    ).join('');

    return {
      subject: 'Vous avez de nouveaux messages non lus',
      text: `Bonjour ${data.username || ''},\n\nVous avez ${data.unreadCount} message(s) non lu(s) dans vos conversations.\n\n${data.messages.map(m => `- ${m.content}`).join('\n')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">📬 Vous avez de nouveaux messages</h2>
          <p>Bonjour <strong>${data.username || ''}</strong>,</p>
          <p>Vous avez <strong>${data.unreadCount}</strong> message(s) non lu(s) dans vos conversations.</p>
          
          ${messageList ? `
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #495057;">Messages récents:</h4>
              ${messageList}
            </div>
          ` : ''}
          
          <p style="margin-top: 30px;">
            <a href="#" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Voir les messages
            </a>
          </p>
          
          <p style="color: #6c757d; font-size: 12px;">
            Si vous ne souhaitez plus recevoir ces notifications, vous pouvez les désactiver dans vos paramètres.
          </p>
          
          <br>
          <p>Best regards,<br>The Conversation App Team</p>
        </div>
      `
    };
  }
}
