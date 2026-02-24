import { MessageNotificationCron } from './message-notification.cron';
import { Repository } from 'typeorm';
import { MessageEntity } from './entities/message.entities';
import { ConversationEntity } from '../conversation/entities/conversation.entities';
import { UserProfileEntity } from '../auth/entities/user_profile.entities';
import { UserCredentialsEntity } from '../auth/entities/user_credentials.entities';

jest.mock('nodemailer', () => {
  const sendMail = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });
  const createTransport = jest.fn(() => ({ sendMail }));

  return {
    createTestAccount: jest.fn().mockResolvedValue({
      user: 'test-user',
      pass: 'test-pass',
    }),
    createTransport,
    getTestMessageUrl: jest.fn(),
    // Expose mocks for assertions
    __mocks__: {
      sendMail,
      createTransport,
    },
  };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

describe('MessageNotificationCron', () => {
  let cron: MessageNotificationCron;
  let messageRepository: jest.Mocked<Repository<MessageEntity>>;
  let conversationRepository: jest.Mocked<Repository<ConversationEntity>>;
  let userProfileRepository: jest.Mocked<Repository<UserProfileEntity>>;
  let userCredentialsRepository: jest.Mocked<Repository<UserCredentialsEntity>>;

  beforeEach(() => {
    messageRepository = {
      find: jest.fn(),
      update: jest.fn(),
    } as any;

    conversationRepository = {
      find: jest.fn(),
    } as any;

    userProfileRepository = {
      find: jest.fn(),
    } as any;

    userCredentialsRepository = {
      find: jest.fn(),
    } as any;

    cron = new MessageNotificationCron(
      messageRepository,
      conversationRepository,
      userProfileRepository,
      userCredentialsRepository,
    );
  });

  it('should send email and mark messages as mail sent when conditions are met', async () => {
    const past = new Date(Date.now() - 60 * 60 * 1000); // 1h ago

    const unreadMessage: any = {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'sender-1',
      isRead: false,
      isMailSent: false,
    };

    messageRepository.find.mockResolvedValue([unreadMessage]);

    const conversation: any = {
      id: 'conv-1',
      participants: [{ id: 'profile-1', userCredentialsId: 'user-1' }],
    };
    conversationRepository.find.mockResolvedValue([conversation]);

    const profile: any = {
      id: 'profile-1',
      userCredentialsId: 'user-1',
    };
    userProfileRepository.find.mockResolvedValue([profile]);

    const credentials: any = {
      id: 'user-1',
      email: 'user@example.com',
      lastConnectionAt: past,
    };
    userCredentialsRepository.find.mockResolvedValue([credentials]);

    await cron.handleUnreadMessagesNotification();

    const sendMail = (nodemailer.__mocks__.sendMail as jest.Mock);
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail.mock.calls[0][0].to).toBe('user@example.com');

    expect(messageRepository.update).toHaveBeenCalledTimes(1);
    expect(messageRepository.update.mock.calls[0][1]).toEqual({ isMailSent: true });
  });

  it('should not send email when there are no unread messages', async () => {
    messageRepository.find.mockResolvedValue([]);

    const sendMail = (nodemailer.__mocks__.sendMail as jest.Mock);
    sendMail.mockClear();

    await cron.handleUnreadMessagesNotification();

    expect(sendMail).not.toHaveBeenCalled();
    expect(messageRepository.update).not.toHaveBeenCalled();
  });
});

