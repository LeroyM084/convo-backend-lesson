import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AUTH_REPOSITORY, IAuthRepository } from './auth.repository.interface';
import { PASSWORD_HASHER } from './interface/password-hasher.interface';
import { JWT_SERVICE } from './interface/jwt.interface';
import { EVENT_BUS, EventBusPort } from '../../core/event/event-bus.port';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: jest.Mocked<IAuthRepository>;
  let passwordHasher: { hash: jest.Mock; compare: jest.Mock };
  let jwtService: { generateToken: jest.Mock; verifyToken: jest.Mock };

  beforeEach(async () => {
    authRepository = {
      findCredentialsByEmail: jest.fn(),
      createCredentials: jest.fn(),
      checkEmailExists: jest.fn(),
      createProfile: jest.fn(),
      findProfileByCredentialsId: jest.fn(),
      updateProfile: jest.fn(),
      deleteProfile: jest.fn(),
      findProfileByUsername: jest.fn(),
      updateCredentials: jest.fn(),
      findCredentialsById: jest.fn(),
    };

    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    jwtService = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
    };

    const eventBus: EventBusPort = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AUTH_REPOSITORY, useValue: authRepository },
        { provide: PASSWORD_HASHER, useValue: passwordHasher },
        { provide: JWT_SERVICE, useValue: jwtService },
        { provide: EVENT_BUS, useValue: eventBus },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should update lastConnectionAt on successful login', async () => {
    const nowBefore = new Date();

    const credentials: any = {
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed',
      rights: BigInt(0),
      createdAt: new Date(),
      lastConnectionAt: null,
    };

    authRepository.findCredentialsByEmail.mockResolvedValue(credentials);
    passwordHasher.compare.mockResolvedValue(true);
    jwtService.generateToken
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    const result = await service.login({ email: 'test@example.com', password: 'password123!' } as any);

    expect(result).toEqual({
      acces_token: 'access-token',
      refresh_token: 'refresh-token',
    });

    expect(authRepository.updateCredentials).toHaveBeenCalledTimes(1);
    const updated = authRepository.updateCredentials.mock.calls[0][0];
    expect(updated.lastConnectionAt).toBeInstanceOf(Date);
    expect((updated.lastConnectionAt as Date).getTime()).toBeGreaterThanOrEqual(nowBefore.getTime());
  });

  it('should update lastConnectionAt on successful refresh', async () => {
    const credentials: any = {
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed',
      rights: BigInt(0),
      createdAt: new Date(),
      lastConnectionAt: null,
    };

    jwtService.verifyToken.mockResolvedValue({ userCredentials: { id: 'user-1' } });
    authRepository.findCredentialsById.mockResolvedValue(credentials);
    jwtService.generateToken
      .mockResolvedValueOnce('new-access-token')
      .mockResolvedValueOnce('new-refresh-token');

    const result = await service.refresh('some-refresh-token');

    expect(result).toEqual({
      acces_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
    });

    expect(authRepository.updateCredentials).toHaveBeenCalledTimes(1);
    const updated = authRepository.updateCredentials.mock.calls[0][0];
    expect(updated.lastConnectionAt).toBeInstanceOf(Date);
  });
});

