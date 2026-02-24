import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { MESSAGE_REPOSITORY, IMessageRepository } from './message.repository.interface';

describe('MessageService', () => {
  let service: MessageService;
  let messageRepository: jest.Mocked<IMessageRepository>;

  beforeEach(async () => {
    messageRepository = {
      findCredentialsByEmail: jest.fn(),
      createMessage: jest.fn(),
      getMessagesByConversationId: jest.fn(),
      markMessagesAsReadForUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: MESSAGE_REPOSITORY, useValue: messageRepository },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should return messages for a conversation', async () => {
    const messages: any[] = [
      { id: 'm1', content: 'Hello' },
      { id: 'm2', content: 'World' },
    ];
    messageRepository.getMessagesByConversationId.mockResolvedValue(messages as any);

    const result = await service.getConversationMessages('conversation-1');

    expect(messageRepository.getMessagesByConversationId).toHaveBeenCalledWith('conversation-1');
    expect(result).toEqual(messages);
  });

  it('should mark messages as read and then return them', async () => {
    const messages: any[] = [{ id: 'm1', content: 'Hello', isRead: false }];
    messageRepository.getMessagesByConversationId.mockResolvedValue(messages as any);

    const result = await service.markConversationMessagesAsReadForUser('conversation-1', 'user-1');

    expect(messageRepository.markMessagesAsReadForUser).toHaveBeenCalledWith('conversation-1', 'user-1');
    expect(messageRepository.getMessagesByConversationId).toHaveBeenCalledWith('conversation-1');
    expect(result).toEqual(messages);
  });
});

