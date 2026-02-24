import { Injectable, Inject, ExecutionContext } from '@nestjs/common';
import { AUTH_REPOSITORY, IAuthRepository } from './auth.repository.interface';
import { UserCredentialsEntity } from './entities/user_credentials.entities';
import { LoginDTO, RegisterDTO } from './types/auth.dto';
import { PASSWORD_HASHER } from './interface/password-hasher.interface';
import { PasswordHasherService } from './password-hasher.service';
import * as jwt from 'jsonwebtoken';
import { JWT_SERVICE, JWTServiceInterface } from './interface/jwt.interface';
import { JWTService } from './jwt.service';
import { EVENT_BUS, EventBusPort } from '../../core/event/event-bus.port';
import { UserRegisteredEvent } from './event/user-registered.event';
import { InvalidCredentialsError, InvalidRefreshTokenError, UserNotFoundError } from './errors/auth.errors';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasherService,
    @Inject(JWT_SERVICE) private readonly jwtService: JWTService,
    @Inject(EVENT_BUS) private readonly eventBus: EventBusPort,
  ) { }

  async register(dto: RegisterDTO): Promise<boolean | string> {
    const emailExists = await this.authRepository.checkEmailExists(dto.email);
    if (emailExists) {
      return "Email already in use";
    }
    const hashedPassword = await this.passwordHasher.hash(dto.password);
    const userCredentials = new UserCredentialsEntity();
    userCredentials.email = dto.email;
    userCredentials.passwordHash = hashedPassword;
    await this.authRepository.createCredentials(userCredentials);

    const userProfile = await this.authRepository.createProfile(dto.username, userCredentials.id);
    console.log(userProfile);

    // Trigger event for NodeMailer
    await this.eventBus.publish(UserRegisteredEvent.create({
      email: dto.email,
      id: userCredentials.id,
      username: dto.username,
    }));

    return true;
  }

  async login(dto: LoginDTO): Promise<object | null> {
    const userCredentials = await this.authRepository.findCredentialsByEmail(dto.email);
    if (!userCredentials) {
      throw new InvalidCredentialsError();
    }

    if (!await this.passwordHasher.compare(dto.password, userCredentials.passwordHash)) {
      throw new InvalidCredentialsError();
    }

    const acces_token = await this.jwtService.generateToken({ userCredentials });
    const refresh_token = await this.jwtService.generateToken({ userCredentials }, '7d');

    userCredentials.lastConnectionAt = new Date();
    await this.authRepository.updateCredentials(userCredentials);

    return { acces_token, refresh_token };
  }

  async refresh(refreshToken: string): Promise<object | null> {
    let payload: any;
    try {
      payload = await this.jwtService.verifyToken(refreshToken);
    } catch {
      throw new InvalidRefreshTokenError();
    }

    const userCredentialsId = payload?.userCredentials?.id;
    if (!userCredentialsId) {
      throw new InvalidRefreshTokenError();
    }

    const userCredentials = await this.authRepository.findCredentialsById(userCredentialsId);
    if (!userCredentials) {
      throw new UserNotFoundError();
    }

    userCredentials.lastConnectionAt = new Date();
    await this.authRepository.updateCredentials(userCredentials);

    const acces_token = await this.jwtService.generateToken({ userCredentials });
    const new_refresh_token = await this.jwtService.generateToken({ userCredentials }, '7d');

    return { acces_token, refresh_token: new_refresh_token };
  }


}


